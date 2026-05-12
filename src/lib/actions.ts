"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { GigStatus, UserRole } from "@prisma/client"
import type { ApplicationStatus } from "@prisma/client"
import { z } from "zod"
import { signIn, auth } from "@/lib/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { getUploadUrl, getPublicUrl, getDownloadUrl } from "./s3"

const SubmissionSchema = z.object({
  applicationId: z.string().uuid(),
  notes: z.string().optional(),
  fileName: z.string().optional(),
  fileKey: z.string().optional(),
})

export async function getFileDownloadUrl(fileKey: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Optional: Add more strict checks here to ensure the user has access to this specific file
  // For now, we allow any logged-in user to generate a download URL if they have the key
  return await getDownloadUrl(fileKey)
}

export async function getSubmissionUploadUrl(fileName: string, contentType: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== UserRole.STUDENT) {
    throw new Error("Unauthorized")
  }

  const fileExtension = fileName.split(".").pop()
  const key = `submissions/${session.user.id}/${Date.now()}.${fileExtension}`
  const url = await getUploadUrl(key, contentType)

  return { url, key }
}

export async function createSubmission(data: z.infer<typeof SubmissionSchema>) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== UserRole.STUDENT) {
    return { error: "Unauthorized" }
  }

  const validated = SubmissionSchema.safeParse(data)
  if (!validated.success) {
    return { error: "Invalid data" }
  }

  const { applicationId, notes, fileName, fileKey } = validated.data

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { studentId: true, status: true, gigId: true }
  })

  if (!application || application.studentId !== session.user.id || application.status !== "ACCEPTED") {
    return { error: "Invalid application" }
  }

  try {
    await prisma.submission.create({
      data: {
        applicationId,
        notes,
        fileName,
        fileKey,
        fileUrl: fileKey ? getPublicUrl(fileKey) : null,
        status: "PENDING"
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Submission error:", error)
    return { error: "Failed to create submission" }
  }
}

export async function reviewSubmission(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== UserRole.CLIENT) {
    return { error: "Unauthorized" }
  }

  const submissionId = formData.get("submissionId") as string
  const action = formData.get("action") as "ACCEPT" | "REDO"
  const feedback = formData.get("feedback") as string

  if (!submissionId || !action) {
    return { error: "Missing data" }
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      application: {
        include: { gig: true }
      }
    }
  })

  if (!submission || submission.application.gig.clientId !== session.user.id) {
    return { error: "Unauthorized" }
  }

  try {
    if (action === "ACCEPT") {
      await prisma.$transaction([
        prisma.submission.update({
          where: { id: submissionId },
          data: { status: "ACCEPTED", feedback }
        }),
        prisma.gig.update({
          where: { id: submission.application.gigId },
          data: { status: GigStatus.COMPLETED }
        })
      ])
    } else {
      await prisma.submission.update({
        where: { id: submissionId },
        data: { status: "REDO", feedback }
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Review error:", error)
    return { error: "Failed to process review" }
  }
}

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([UserRole.STUDENT, UserRole.CLIENT]), // Admin cannot signup publicly
})

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const GigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
})

const APPLICATION_STATUS = {
  PENDING: "PENDING" as ApplicationStatus,
  ACCEPTED: "ACCEPTED" as ApplicationStatus,
  REJECTED: "REJECTED" as ApplicationStatus,
} as const

export async function signup(formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { name, email, password, role } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: { email: ["Email already in use"] } }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error details:", error)
    return { error: { message: `Signup failed: ${error instanceof Error ? error.message : "Unknown error"}` } }
  }
}

export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { email, password } = validatedFields.data

  try {
    console.log("Actions: Attempting login for", email)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    // Fetch the user to determine their role for the redirect
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })

    if (!user) {
      console.error("Actions: User not found after successful signIn for", email)
      return { error: { message: "Account configuration error" } }
    }

    const dashboardMap = {
      STUDENT: "/student",
      CLIENT: "/client",
      ADMIN: "/admin",
    }

    console.log("Actions: Redirecting", email, "to", dashboardMap[user.role])
    return { success: true, redirectTo: dashboardMap[user.role] }
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Actions: AuthError during login for", email, "-", error.type)
      switch (error.type) {
        case "CredentialsSignin":
          return { error: { message: "Invalid email or password" } }
        default:
          return { error: { message: "Authentication failed. Please try again." } }
      }
    }
    console.error("Actions: Unexpected error during login for", email, error)
    throw error
  }
}

export async function createGig(formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.CLIENT) {
    return { error: { message: "Only clients can create gigs" } }
  }

  const validatedFields = GigSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { title, description, budget } = validatedFields.data

  try {
    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        budget,
        clientId: session.user.id,
      },
    })
    
    // Redirect is handled by the component or here
  } catch (error) {
    console.error("Gig creation error:", error)
    return { error: { message: "Failed to create gig" } }
  }

  redirect("/client")
}

export async function applyForGig(formData: FormData) {
  const session = await auth()
  const gigId = formData.get("gigId")

  if (typeof gigId !== "string" || !gigId) {
    redirect("/gigs")
  }

  if (!session?.user?.id) {
    const callbackUrl = encodeURIComponent(`/gigs/${gigId}`)
    redirect(`/login?callbackUrl=${callbackUrl}`)
  }

  if (session.user.role !== UserRole.STUDENT) {
    redirect(`/gigs/${gigId}`)
  }

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: { id: true, status: true },
  })

  if (!gig || gig.status !== GigStatus.OPEN) {
    redirect(`/gigs/${gigId}`)
  }

  await prisma.application.upsert({
    where: { gigId_studentId: { gigId, studentId: session.user.id } },
    update: {},
    create: {
      gigId,
      studentId: session.user.id,
      status: APPLICATION_STATUS.PENDING,
    },
  })

  redirect(`/gigs/${gigId}?applied=1`)
}

export async function acceptApplication(formData: FormData) {
  const session = await auth()
  const applicationId = formData.get("applicationId")

  if (typeof applicationId !== "string" || !applicationId) {
    redirect("/client")
  }

  if (!session?.user?.id || session.user.role !== UserRole.CLIENT) {
    redirect("/login")
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      gig: { select: { id: true, clientId: true } },
    },
  })

  if (!application || application.gig.clientId !== session.user.id) {
    redirect("/client")
  }

  await prisma.$transaction([
    prisma.application.updateMany({
      where: { gigId: application.gigId, id: { not: applicationId } },
      data: { status: APPLICATION_STATUS.REJECTED },
    }),
    prisma.application.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.ACCEPTED },
    }),
    prisma.gig.update({
      where: { id: application.gigId },
      data: { status: GigStatus.IN_PROGRESS },
    }),
  ])

  redirect(`/client/gigs/${application.gigId}/applications`)
}

export async function rejectApplication(formData: FormData) {
  const session = await auth()
  const applicationId = formData.get("applicationId")
  const gigId = formData.get("gigId")

  if (typeof applicationId !== "string" || !applicationId) {
    redirect("/client")
  }

  if (!session?.user?.id || session.user.role !== UserRole.CLIENT) {
    redirect("/login")
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      gig: { select: { id: true, clientId: true } },
    },
  })

  if (!application || application.gig.clientId !== session.user.id) {
    redirect("/client")
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: APPLICATION_STATUS.REJECTED },
  })

  if (typeof gigId === "string" && gigId) {
    redirect(`/client/gigs/${gigId}/applications`)
  }

  redirect(`/client/gigs/${application.gigId}/applications`)
}
