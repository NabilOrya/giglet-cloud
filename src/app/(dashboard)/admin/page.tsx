import { Users, Briefcase, AlertCircle, ShieldCheck, Activity, BarChart } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  // Audit Check: Fetching real-time stats from RDS
  const userCount = await prisma.user.count()
  const gigCount = await prisma.gig.count()
  
  console.log(`[ADMIN AUDIT] Time: ${new Date().toISOString()} | Users: ${userCount} | Gigs: ${gigCount}`)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground mt-1">Platform overview and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: userCount.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Total Gigs", value: gigCount.toString(), icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Active Reports", value: "0", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
          { title: "System Health", value: "99.9%", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat) => (
          <div key={stat.title} className="card-gradient p-6 rounded-3xl">
            <div className={`${stat.bg} ${stat.color} h-10 w-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-gradient p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Platform Activity</h3>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/30">
            <p className="text-muted-foreground text-sm font-medium">Activity graph coming soon</p>
          </div>
        </div>

        <div className="card-gradient p-8 rounded-3xl border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">System Status</h3>
              <p className="text-green-600 dark:text-green-400 text-sm font-bold">All services operational</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            The platform is running smoothly on AWS EC2 standalone mode with RDS PostgreSQL connectivity. No incidents reported in the last 24 hours.
          </p>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
