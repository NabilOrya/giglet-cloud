import { Wallet, Zap, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AcceptedGigsList } from "@/components/dashboard/accepted-gigs-list"

export const dynamic = "force-dynamic"

export default async function StudentDashboard() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role !== "STUDENT") {
    if (session.user.role === "ADMIN") redirect("/admin")
    if (session.user.role === "CLIENT") redirect("/client")
    redirect("/")
  }

  // Fetch real-time stats from RDS
  const totalOpenGigs = await prisma.gig.count({
    where: { status: "OPEN" }
  })

  const [totalApplications, pendingApplications, acceptedApplicationsCount, totalEarningsResult] = await Promise.all([
    prisma.application.count({ where: { studentId: session.user.id } }),
    prisma.application.count({ where: { studentId: session.user.id, status: "PENDING" } }),
    prisma.application.count({ where: { studentId: session.user.id, status: "ACCEPTED" } }),
    prisma.gig.aggregate({
      where: {
        applications: {
          some: {
            studentId: session.user.id,
            submissions: {
              some: { status: "ACCEPTED" }
            }
          }
        },
        status: "COMPLETED"
      },
      _sum: { budget: true }
    })
  ])

  const totalEarnings = totalEarningsResult._sum.budget || 0

  const acceptedGigs = await prisma.application.findMany({
    where: { 
      studentId: session.user.id, 
      status: "ACCEPTED" 
    },
    include: {
      gig: true,
      submissions: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  const latestGigs = await prisma.gig.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      client: {
        select: { name: true }
      }
    }
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Explore opportunities and track your growth.</p>
        </div>
        <Link href="/gigs" className="btn-primary w-fit flex items-center gap-2">
          Find Work <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Available Gigs", value: totalOpenGigs.toString(), icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "My Applications", value: totalApplications.toString(), icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Total Earnings", value: `$${totalEarnings.toLocaleString()}`, icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Accepted Gigs", value: acceptedApplicationsCount.toString(), icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat) => (
          <div key={stat.title} className="card-gradient p-6 rounded-3xl border border-border/50">
            <div className={`${stat.bg} ${stat.color} h-10 w-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Accepted Gigs Section */}
      <AcceptedGigsList gigs={acceptedGigs} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Opportunities</h2>
          <Link href="/gigs" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>

        {latestGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestGigs.map((gig) => (
              <Link 
                key={gig.id} 
                href={`/gigs/${gig.id}`}
                className="card-gradient p-6 rounded-3xl border border-border/50 hover:border-primary/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    ${gig.budget}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    {new Date(gig.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{gig.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {gig.description}
                </p>
                <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                    {gig.client.name?.charAt(0) || "C"}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{gig.client.name}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-gradient p-10 rounded-3xl text-center border-dashed border-2 bg-muted/20">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No active gigs available</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Check back later or refine your search to find more opportunities.
              </p>
              <Link href="/gigs" className="btn-primary inline-block">
                Browse Marketplace
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
