import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Calendar, DollarSign, User } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function GigDetailPage({ params }: { params: { id: string } }) {
  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
    include: { client: { select: { name: true, email: true } } }
  })

  if (!gig) notFound()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {gig.status}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(gig.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {gig.title}
              </h1>

              <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="flex-grow">
                  <h2 className="text-lg font-bold mb-3">Description</h2>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                    {gig.description}
                  </p>
                </div>

                <div className="w-full md:w-64 shrink-0">
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-1">Budget</p>
                      <p className="text-2xl font-extrabold text-blue-600 flex items-center">
                        <DollarSign className="h-6 w-6" />
                        {gig.budget}
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-1">Posted By</p>
                      <p className="font-bold flex items-center text-gray-900 dark:text-white">
                        <User className="h-4 w-4 mr-2" />
                        {gig.client.name}
                      </p>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                      Apply Now
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-2">Applications are coming in Phase 2B</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
