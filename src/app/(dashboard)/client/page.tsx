import { PlusCircle, Users, Briefcase, BarChart3, Eye, MoreVertical } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ClientDashboard() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch real-time stats from RDS
  const totalGigsPosted = await prisma.gig.count({
    where: { clientId: session.user.id }
  })

  const recentGigs = await prisma.gig.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: { applications: true }
      }
    }
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your gigs and talent from one place.</p>
        </div>
        <Link href="/gigs/new" className="btn-primary flex items-center justify-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Post a New Gig
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Gigs Posted", value: totalGigsPosted.toString(), icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Active Projects", value: "0", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Total Spent", value: "$0.00", icon: BarChart3, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Hired Talent", value: "0", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Gigs</h2>
          <Link href="/gigs" className="text-sm font-bold text-primary hover:underline">Manage All</Link>
        </div>

        {recentGigs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentGigs.map((gig) => (
              <div 
                key={gig.id} 
                className="card-gradient p-6 rounded-3xl border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{gig.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      gig.status === "OPEN" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                    }`}>
                      {gig.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      ${gig.budget}
                    </span>
                    <span>•</span>
                    <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {gig._count.applications} Applicants
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href={`/gigs/${gig.id}`}
                    className="p-3 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 text-sm font-bold"
                  >
                    <Eye className="h-4 w-4" />
                    Open Gig
                  </Link>
                  <button className="p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20">
                    <Users className="h-4 w-4" />
                    View Applicants
                  </button>
                  <button className="p-3 rounded-xl hover:bg-muted transition-all">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-gradient p-12 rounded-3xl text-center border-dashed border-2 bg-muted/20">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">You have not posted any gigs yet</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Ready to get some work done? Post your first gig and start receiving applications from talented students.
              </p>
              <Link href="/gigs/new" className="btn-primary inline-block">
                Post a Gig
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
