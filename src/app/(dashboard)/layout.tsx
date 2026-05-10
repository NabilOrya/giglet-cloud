import { auth, signOut } from "@/lib/auth"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { LogOut, LayoutDashboard, User } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 p-6">
        <div className="mb-10">
          <Logo />
        </div>
        
        <nav className="flex-grow space-y-2">
          <Link href={`/dashboard/${session?.user?.role?.toLowerCase()}`} className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-semibold">
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link href="#" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </nav>

        <div className="mt-auto pt-10">
          <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50">
            <p className="text-sm font-bold truncate">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600">
              {session?.user?.role}
            </span>
          </div>
          
          <form action={async () => {
            "use server"
            await signOut()
          }}>
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-semibold">
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
