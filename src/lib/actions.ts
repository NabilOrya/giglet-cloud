"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import { signIn, auth } from "@/lib/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

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
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    // Fetch the user to determine their role for the redirect
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })

    if (!user) return { error: { message: "User not found" } }

    const dashboardMap = {
      STUDENT: "/dashboard/student",
      CLIENT: "/dashboard/client",
      ADMIN: "/dashboard/admin",
    }

    return { success: true, redirectTo: dashboardMap[user.role] }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: { message: "Invalid credentials" } }
        default:
          return { error: { message: "Something went wrong" } }
      }
    }
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

  redirect("/dashboard/client")
}
