import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { UserRole } from "@prisma/client"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = nextUrl.pathname.startsWith("/dashboard")
      
      if (isDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as UserRole
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as UserRole
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // We will implement the actual authorization in the full auth.ts
        // because it needs the Prisma client which we don't want in the middleware-compatible config
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
