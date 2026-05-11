import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Calendar, DollarSign, User, ArrowLeft, ShieldCheck, Briefcase } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { applyForGig } from "@/lib/actions"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function GigDetailPage({
  params,
  searchParams,
}: {
  params: { id?: string; gigId?: string }
  searchParams?: { applied?: string }
}) {
  const session = await auth()

  const gigId = params.id ?? params.gigId
  if (!gigId) {
    console.log("[GIG DETAIL] Missing gig id param", params)
    notFound()
  }

  const gig = await prisma.gig.findFirst({
    where: { id: gigId },
    include: { client: { select: { name: true, email: true } } }
  })

  if (!gig) {
    const exists = await prisma.gig.count({ where: { id: gigId } })
    console.log("[GIG DETAIL] Gig not found", { gigId, exists })
    notFound()
  }

  const studentApplication =
    session?.user?.role === "STUDENT"
      ? await prisma.application.findUnique({
          where: { gigId_studentId: { gigId: gig.id, studentId: session.user.id } },
          select: { status: true },
        })
      : null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/gigs" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Gig Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card-gradient p-8 md:p-12 rounded-[2rem]">
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {gig.status}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    Posted on {new Date(gig.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
                  {gig.title}
                </h1>

                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-bold mb-4">Project Description</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {gig.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Client Info */}
            <div className="space-y-6">
              <div className="card-gradient p-8 rounded-[2rem] sticky top-32">
                <div className="mb-8">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Project Budget</p>
                  <p className="text-4xl font-black text-primary flex items-center">
                    <DollarSign className="h-8 w-8 -ml-1" />
                    {gig.budget}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center p-4 bg-muted/50 rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Client</p>
                      <p className="font-extrabold">{gig.client.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-muted/50 rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mr-4">
                      <ShieldCheck className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Status</p>
                      <p className="font-extrabold text-green-500 text-sm">Verified Client</p>
                    </div>
                  </div>
                </div>

                {session?.user?.role === "STUDENT" ? (
                  studentApplication ? (
                    <button
                      disabled
                      className="w-full py-4 text-lg font-bold shadow-xl flex items-center justify-center gap-2 rounded-2xl bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      <Briefcase className="h-5 w-5" />
                      Applied ({studentApplication.status})
                    </button>
                  ) : gig.status !== "OPEN" ? (
                    <button
                      disabled
                      className="w-full py-4 text-lg font-bold shadow-xl flex items-center justify-center gap-2 rounded-2xl bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      <Briefcase className="h-5 w-5" />
                      Applications Closed
                    </button>
                  ) : (
                    <form action={applyForGig}>
                      <input type="hidden" name="gigId" value={gig.id} />
                      <button className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Apply for this Gig
                      </button>
                    </form>
                  )
                ) : session?.user?.id ? (
                  <button
                    disabled
                    className="w-full py-4 text-lg font-bold shadow-xl flex items-center justify-center gap-2 rounded-2xl bg-muted text-muted-foreground cursor-not-allowed"
                  >
                    <Briefcase className="h-5 w-5" />
                    Students Only
                  </button>
                ) : (
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/gigs/${gig.id}`)}`}
                    className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Briefcase className="h-5 w-5" />
                    Sign in to Apply
                  </Link>
                )}

                {searchParams?.applied === "1" && (
                  <p className="text-[10px] text-center text-green-600 dark:text-green-400 mt-4 font-bold uppercase tracking-tighter">
                    Application submitted
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
