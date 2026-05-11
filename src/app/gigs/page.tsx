import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

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
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Available Gigs</h1>
            <Link 
              href="/gigs/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Post a Gig
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-12">No gigs available yet.</p>
            ) : (
              gigs.map((gig) => (
                <Link 
                  key={gig.id} 
                  href={`/gigs/${gig.id}`}
                  className="block p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-all shadow-sm"
                >
                  <h2 className="text-xl font-bold mb-2 line-clamp-1">{gig.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{gig.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-blue-600 font-bold">${gig.budget}</span>
                    <span className="text-xs text-gray-500">By {gig.client.name}</span>
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
