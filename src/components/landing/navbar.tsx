"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  if (isAuthPage) return null

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/gigs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse Gigs
            </Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <ThemeToggle />
            <Link href="/signup" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
