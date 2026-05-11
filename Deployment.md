# Giglet Deployment Guide — AWS EC2 (Standalone Mode)

This document covers deploying Giglet (App Router) to an AWS EC2 instance (private subnet) behind an Application Load Balancer (ALB), using Next.js `output: "standalone"`.

## Prerequisites
- EC2 Instance (Ubuntu/Linux) in Private Subnet
- RDS PostgreSQL instance accessible from EC2
- ALB Target Group pointing to EC2 on port `3000`
- Node.js 20+ installed on EC2
- PM2 installed (`npm install -g pm2`)
- Repository is clean:
  - `.next/` is ignored and not tracked
  - `tsconfig.tsbuildinfo` is ignored and not tracked

## Environment Configuration (`.env` on EC2)
Create a `.env` file in the repo root on EC2:

```env
DATABASE_URL="postgresql://<username>:<password>@<rds-endpoint>:5432/<db-name>?schema=public"
AUTH_SECRET="<32+ char secret>"
AUTH_URL="http://<your-alb-dns-name>"
NODE_ENV="production"
```

Important:
- `AUTH_URL` must match the ALB URL exactly (no backticks, no extra spaces).

## Recommended Deployment Flow (Build on EC2)
From inside the repo directory on EC2:

```bash
git pull origin main

pnpm install
pnpm exec prisma generate

# Sync schema to RDS (repo uses db push; no migrations folder)
pnpm exec prisma db push

rm -rf .next
pnpm build

# Standalone asset sync (required for Next.js standalone output)
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```

### Start / Restart with PM2
```bash
pm2 start .next/standalone/server.js --name giglet --update-env --time --interpreter node --env production
pm2 save
```

If already running:
```bash
pm2 restart giglet --update-env
```

## ALB & Security Group Verification
- ALB SG: allow 80/443 from 0.0.0.0/0
- EC2 SG: allow 3000 ONLY from the ALB SG
- RDS SG: allow 5432 ONLY from the EC2 SG

## Troubleshooting
- 502 from ALB: `pm2 list` and `pm2 logs giglet`
- Auth redirect issues: verify `AUTH_URL` and that the app trusts the proxy (`trustHost: true` in Auth)
- DB errors: ensure `pnpm exec prisma db push` succeeded and RDS is reachable from EC2
