import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { acceptApplication, rejectApplication } from "@/lib/actions"
import { ArrowLeft, Briefcase, Calendar, User as UserIcon, Mail, CheckCircle2, XCircle, FileSearch, RotateCcw } from "lucide-react"
import { ReviewButton } from "@/components/dashboard/review-button"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function ClientGigApplicationsPage(props: {
  params: Promise<{ gigId?: string; id?: string }>
}) {
  const session = await auth()
  const params = await props.params

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role !== "CLIENT") {
    if (session.user.role === "ADMIN") redirect("/admin")
    if (session.user.role === "STUDENT") redirect("/student")
    redirect("/")
  }

  const gigId = params.gigId ?? params.id
  if (!gigId) notFound()

  const gig = await prisma.gig.findFirst({
    where: { id: gigId },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: {
          student: { select: { id: true, name: true, email: true } },
          submissions: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        },
      },
    },
  })

  if (!gig) notFound()
  if (gig.clientId !== session.user.id) redirect("/client")

  const acceptedApplicationId =
    gig.applications.find((a) => a.status === "ACCEPTED")?.id ?? null

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/client" className="p-2 hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Applications</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage applicants for <span className="font-bold text-foreground">{gig.title}</span>.
            </p>
          </div>
        </div>
        <Link href={`/gigs/${gig.id}`} className="btn-secondary flex items-center justify-center gap-2">
          <Briefcase className="h-4 w-4" />
          Open Gig
        </Link>
      </div>

      {gig.applications.length === 0 ? (
        <div className="card-gradient p-12 rounded-3xl text-center border-dashed border-2 bg-muted/20">
          <div className="max-w-md mx-auto">
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No applications yet</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              When students apply, they will appear here for review.
            </p>
            <Link href="/client" className="btn-primary inline-block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {gig.applications.map((application) => {
            const isAccepted = application.status === "ACCEPTED"
            const isRejected = application.status === "REJECTED"
            const isPending = application.status === "PENDING"
            const acceptDisabled =
              acceptedApplicationId !== null && acceptedApplicationId !== application.id
            
            const latestSubmission = application.submissions[0]

            return (
              <div
                key={application.id}
                className="card-gradient p-6 rounded-3xl border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {application.student.name?.charAt(0) || <UserIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {application.student.name || "Unnamed Student"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {application.student.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isAccepted
                          ? "bg-green-500/10 text-green-600"
                          : isRejected
                            ? "bg-red-500/10 text-red-600"
                            : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {isAccepted ? <CheckCircle2 className="h-3 w-3" /> : isRejected ? <XCircle className="h-3 w-3" /> : null}
                      {application.status}
                    </span>

                    {latestSubmission && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        latestSubmission.status === "PENDING" 
                          ? "bg-orange-500/10 text-orange-600 animate-pulse" 
                          : latestSubmission.status === "ACCEPTED"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-orange-500/10 text-orange-600"
                      }`}>
                        {latestSubmission.status === "PENDING" && <FileSearch className="h-3 w-3" />}
                        {latestSubmission.status === "ACCEPTED" && <CheckCircle2 className="h-3 w-3" />}
                        {latestSubmission.status === "REDO" && <RotateCcw className="h-3 w-3" />}
                        Submission: {latestSubmission.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAccepted && latestSubmission && latestSubmission.status === "PENDING" ? (
                    <ReviewButton 
                      submission={latestSubmission} 
                      studentName={application.student.name || "Student"} 
                    />
                  ) : (
                    <>
                      <form action={acceptApplication}>
                        <input type="hidden" name="applicationId" value={application.id} />
                        <button
                          disabled={isAccepted || isRejected || acceptDisabled}
                          className={`p-3 rounded-xl transition-all flex items-center gap-2 text-sm font-bold ${
                            isAccepted
                              ? "bg-green-500/10 text-green-700 cursor-not-allowed"
                              : acceptDisabled || isRejected
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept
                        </button>
                      </form>

                      <form action={rejectApplication}>
                        <input type="hidden" name="applicationId" value={application.id} />
                        <input type="hidden" name="gigId" value={gig.id} />
                        <button
                          disabled={isRejected || isAccepted}
                          className={`p-3 rounded-xl transition-all flex items-center gap-2 text-sm font-bold ${
                            isRejected
                              ? "bg-red-500/10 text-red-700 cursor-not-allowed"
                              : isAccepted
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-muted/50 hover:bg-red-500/10 hover:text-red-600"
                          }`}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </form>
                    </>
                  )}

                  {isPending && acceptedApplicationId !== null && acceptDisabled && (
                    <span className="text-xs font-bold text-muted-foreground">
                      Another student is accepted
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
