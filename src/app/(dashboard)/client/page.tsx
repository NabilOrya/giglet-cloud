import { PlusCircle, Users, Briefcase, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function ClientDashboard() {
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
          { title: "Open Gigs", value: "0", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Total Spent", value: "$0.00", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Active Talent", value: "0", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Completion", value: "0%", icon: BarChart3, color: "text-orange-500", bg: "bg-orange-500/10" },
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

      <div className="card-gradient p-12 rounded-3xl text-center border-dashed bg-muted/20">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Active Gigs</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Ready to get some work done? Post your first gig and start receiving applications from talented students.
          </p>
          <Link href="/gigs/new" className="btn-primary inline-block">
            Post a Gig
          </Link>
        </div>
      </div>
    </div>
  )
}
