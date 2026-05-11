"use client"

import { signOut } from "next-auth/react"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LogOut, 
  LayoutDashboard, 
  User, 
  Settings, 
  Search,
  PlusCircle,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarItem {
  title: string
  href: string
  icon: any
}

export function Sidebar({ session }: { session: any }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const role = session?.user?.role?.toLowerCase()
  
  const menuItems: SidebarItem[] = [
    { title: "Overview", href: `/${role}`, icon: LayoutDashboard },
    { title: "Browse Gigs", href: "/gigs", icon: Search },
  ]

  if (role === "client") {
    menuItems.push({ title: "Post a Gig", href: "/gigs/new", icon: PlusCircle })
  }

  menuItems.push({ title: "Profile", href: "#", icon: User })
  menuItems.push({ title: "Settings", href: "#", icon: Settings })

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[50] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[55] w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 px-2">
            <Logo />
          </div>
          
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between px-2">
              <ThemeToggle />
              <button 
                onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {session?.user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">{session?.user?.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{session?.user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
