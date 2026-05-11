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
- **Deployment**: AWS EC2 (Standalone Mode) + ALB
- **Process Manager**: PM2

## 🏗 AWS Infrastructure (Existing)
The application is deployed within a highly secure VPC architecture:
- **VPC**: `10.0.0.0/16`
- **Subnets**: Public (ALB) and Private (EC2 & RDS).
- **Load Balancer**: Application Load Balancer (ALB) handling SSL and traffic distribution.
- **EC2**: Hosting the Next.js standalone server in a private subnet.
- **RDS**: Private PostgreSQL instance accessible only from the EC2 security group.

---

## ✅ Phase 1: Foundation & Authentication (Completed)
The initial phase focused on building a secure, scalable foundation.

### Core Features
- **Modern SaaS Landing Page**: Responsive UI with role-specific CTAs.
- **Authentication System**:
  - Secure Email/Password signup and login.
  - Password hashing using `bcryptjs` (12 rounds).
  - Stateless JWT session management (stateless & ALB-compatible).
- **Role-Based Access Control (RBAC)**:
  - Strict middleware-level route protection.
  - Automatic redirection based on user role (`STUDENT`, `CLIENT`, `ADMIN`).
  - Secure isolation between `/dashboard/student`, `/dashboard/client`, and `/dashboard/admin`.
- **Database Integration**:
  - Prisma ORM with UUID-based User models.
  - Singleton pattern for Prisma Client to prevent connection exhaustion.
- **Deployment Optimization**:
  - Configured for Next.js `standalone` mode.
  - AWS ALB proxy trust configuration (`trustHost`).

### Deployment Summary
- **Runtime**: Node.js 20 (LTS)
- **Process Management**: PM2 managing the `server.js` entry point.
- **Static Assets**: Manually synced `.next/static` and `public` folders for standalone efficiency.

---

## 📖 Local Development
1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Set up `.env` file (see `.env.example`).
4. Generate Prisma client: `pnpm prisma generate`.
5. Run development server: `pnpm dev`.

## 🚢 Production Sync Workflow
After making changes locally:
1. **Push to GitHub**: `git push origin main`
2. **Pull on EC2**: `git pull origin main`
3. **Build**: `pnpm build`
4. **Sync Assets**: Copy `.next/static` and `public` to `.next/standalone`.
5. **Restart**: `pm2 restart giglet`

---
*Status: Phase 1 Stable | Ready for Phase 2: Marketplace Logic*
