import { prisma } from "@/lib/prisma"
import { Briefcase, User as UserIcon, Calendar, DollarSign, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminGigsPage() {
  const gigs = await prisma.gig.findMany({
    include: {
      client: {
        select: { name: true }
      },
      _count: {
        select: { applications: true }
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Platform Gigs</h1>
            <p className="text-muted-foreground mt-1">Audit and monitor all service listings.</p>
          </div>
        </div>
      </div>

      <div className="card-gradient rounded-3xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Gig Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Applications</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Created</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {gigs.length > 0 ? (
                gigs.map((gig) => (
                  <tr key={gig.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">{gig.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{gig.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{gig.client.name || "Unknown Client"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-bold text-green-600 dark:text-green-400">
                        <DollarSign className="h-3.5 w-3.5" />
                        {gig.budget.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        gig.status === "OPEN" 
                          ? "bg-green-500/10 text-green-600" 
                          : gig.status === "IN_PROGRESS"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {gig.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-foreground">
                        {gig._count.applications}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(gig.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/gigs/${gig.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <p className="text-muted-foreground font-medium">No gigs found on the platform</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
