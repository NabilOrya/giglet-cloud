import { Sidebar } from "@/components/dashboard/sidebar"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar session={session} />
      <main className="lg:pl-72 min-h-screen">
        <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
