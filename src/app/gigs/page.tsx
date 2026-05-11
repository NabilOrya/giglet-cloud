import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Search, MapPin, Clock, DollarSign, PlusCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function GigsPage() {
  const gigs = await prisma.gig.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Marketplace</h1>
              <p className="text-muted-foreground mt-2 text-lg">Discover micro-gigs posted by businesses looking for talent.</p>
            </div>
            <Link 
              href="/gigs/new" 
              className="btn-primary flex items-center justify-center gap-2 py-3"
            >
              <PlusCircle className="h-5 w-5" />
              Post a Gig
            </Link>
          </div>

          {/* Search/Filter Bar (UI only for now) */}
          <div className="flex flex-wrap gap-4 mb-10 p-4 bg-muted/30 rounded-2xl border border-border">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for gigs..." 
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <button className="btn-secondary py-2 px-4 text-sm">Category</button>
            <button className="btn-secondary py-2 px-4 text-sm">Budget</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gigs.length === 0 ? (
              <div className="col-span-full py-20 text-center card-gradient rounded-3xl border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold">No gigs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              gigs.map((gig) => (
                <Link 
                  key={gig.id} 
                  href={`/gigs/${gig.id}`}
                  className="card-gradient p-8 rounded-3xl flex flex-col group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {gig.status}
                    </div>
                    <p className="text-lg font-bold text-primary flex items-center">
                      <DollarSign className="h-4 w-4" />
                      {gig.budget}
                    </p>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {gig.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                    {gig.description}
                  </p>
                  
                  <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center mr-2 text-[10px] text-foreground font-bold uppercase">
                        {gig.client.name?.[0] || "U"}
                      </div>
                      {gig.client.name}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
