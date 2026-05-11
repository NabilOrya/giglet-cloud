# Giglet — SaaS Micro-Gig Marketplace

Giglet is a production-grade SaaS platform built to connect talented students with clients looking for high-quality micro-gigs. This project is architected for cloud-native deployment on AWS using a microservices-ready full-stack approach.

## 🚀 Project Overview
Giglet empowers three distinct user roles:
- **STUDENT**: Build portfolios and earn by completing micro-tasks.
- **CLIENT**: Hire verified student talent for fast, affordable work.
- **ADMIN**: Platform governance, moderation, and system monitoring.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **ORM**: Prisma
- **Database**: PostgreSQL (AWS RDS)
- **Authentication**: Auth.js v5 (NextAuth)
- **Deployment**: AWS EC2 (Standalone Mode) on port 3000
- **Process Manager**: PM2

## 🏗 AWS Infrastructure (Current)
- **EC2**: Hosts the Next.js standalone server on port `3000`.
- **RDS**: PostgreSQL database used by Prisma.

---

## ✅ Phase 1: Foundation & Authentication (Completed)
The initial phase focused on building a secure, scalable foundation.

### Core Features
- **Modern SaaS Landing Page**: Responsive UI with role-specific CTAs.
- **Authentication System**:
  - Secure Email/Password signup and login.
  - Password hashing using `bcryptjs` (12 rounds).
  - Stateless JWT session management.
- **Role-Based Access Control (RBAC)**:
  - Strict middleware-level route protection.
  - Automatic redirection based on user role (`STUDENT`, `CLIENT`, `ADMIN`).
  - Secure isolation between `/student`, `/client`, and `/admin`.
- **Database Integration**:
  - Prisma ORM with UUID-based User models.
  - Singleton pattern for Prisma Client to prevent connection exhaustion.
- **Deployment Optimization**:
  - Configured for Next.js `standalone` mode.
  - Proxy-safe Auth.js configuration (`trustHost: true`).

### Deployment Summary
- **Runtime**: Node.js 20 (LTS)
- **Process Management**: PM2 managing the `server.js` entry point.
- **Static Assets**: Manually synced `.next/static` and `public` folders for standalone efficiency.

---

## 📖 Local Development
1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Set up `.env` file (see `.env.example`).
4. Generate Prisma client: `pnpm exec prisma generate`.
5. Run development server: `pnpm dev`.

## 🚢 Production Sync Workflow
After making changes locally:
1. **Push to GitHub**: `git push origin main`.
2. **Pull on EC2**: `git pull origin main`.
3. **Prisma**:
   - `pnpm exec prisma generate`
   - `pnpm exec prisma db push`
4. **Build**: `rm -rf .next && pnpm build`.
5. **Sync Assets (Standalone)**:
   - `cp -r .next/static .next/standalone/.next/`
   - `cp -r public .next/standalone/`
6. **Restart**: `pm2 restart giglet --update-env`.

---
## ✅ Phase 2A/2B: Gigs + Dashboards (Current)
- **Gig Marketplace**:
  - Browse gigs: `/gigs`
  - Create a gig (client only): `/gigs/new`
  - Gig details: `/gigs/[id]`
- **Dashboards (Route Group: `src/app/(dashboard)`; URLs do not include `(dashboard)`)**:
  - Student dashboard: `/student` (shows latest OPEN gigs)
  - Client dashboard: `/client` (shows gigs posted by the logged-in client + applicant count per gig)
  - Admin dashboard: `/admin` (live counts + drill-down)
  - Admin users: `/admin/users`
  - Admin gigs: `/admin/gigs`
- **Applications model**:
  - Prisma includes an `Application` model and a `applications` table in Postgres to support per-gig applicant counts.

---
*Status: Phase 2B Dashboards + Admin Drill-down Stable*
