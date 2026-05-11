import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as UserRole | undefined

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/login", "/signup", "/gigs"].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/gigs/")
  const isDashboardRoute = ["/admin", "/client", "/student"].some(path => nextUrl.pathname.startsWith(path))
  const isGigsNewRoute = nextUrl.pathname === "/gigs/new"

  if (isApiAuthRoute) return NextResponse.next()

  if (isGigsNewRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/gigs/new", nextUrl))
    }
    if (userRole !== UserRole.CLIENT) {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), nextUrl))
    }
    return NextResponse.next()
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      let callbackUrl = nextUrl.pathname
      if (nextUrl.search) callbackUrl += nextUrl.search
      
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
    }

    // Role-based protection logic
    const path = nextUrl.pathname
    
    // Prevent cross-role access
    if (path.startsWith("/student") && userRole !== UserRole.STUDENT) {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), nextUrl))
    }
    if (path.startsWith("/client") && userRole !== UserRole.CLIENT) {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), nextUrl))
    }
    if (path.startsWith("/admin") && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), nextUrl))
    }

    return NextResponse.next()
  }

  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL(getDefaultRoute(userRole), nextUrl))
  }

  return NextResponse.next()
})

function getDefaultRoute(role?: UserRole): string {
  switch (role) {
    case UserRole.ADMIN: return "/admin"
    case UserRole.CLIENT: return "/client"
    case UserRole.STUDENT: return "/student"
    default: return "/"
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
