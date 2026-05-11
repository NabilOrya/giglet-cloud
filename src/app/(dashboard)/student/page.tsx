import { LayoutDashboard, Wallet, Zap, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your progress and earnings at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Gigs", value: "0", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Total Earnings", value: "$0.00", icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Gigs Completed", value: "0", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Success Rate", value: "0%", icon: LayoutDashboard, color: "text-orange-500", bg: "bg-orange-500/10" },
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
      
      <div className="card-gradient p-10 rounded-3xl text-center border-dashed bg-muted/20">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Active Gigs</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            You haven't applied to any gigs yet. Head over to the marketplace to find your first opportunity.
          </p>
          <a href="/gigs" className="btn-primary inline-block">
            Browse Gigs
          </a>
        </div>
      </div>
    </div>
  )
}
