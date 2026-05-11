# Giglet Deployment Guide — AWS EC2 (Standalone Mode)

This document covers deploying Giglet (App Router) directly on an AWS EC2 instance using Next.js `output: "standalone"` (no ALB).

## Prerequisites
- EC2 Instance (Ubuntu/Linux) with a Public IPv4 (or Elastic IP)
- RDS PostgreSQL instance accessible from EC2
- EC2 Security Group allows inbound TCP `3000` from your IP (or 0.0.0.0/0 if you accept public exposure)
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
AUTH_URL="http://44.197.216.71:3000"
NODE_ENV="production"
PORT=3000
```

Important:
- `AUTH_URL` must match the URL you use in the browser exactly (no backticks, no extra spaces).

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
PORT=3000 pm2 start .next/standalone/server.js --name giglet --update-env --time --interpreter node --env production
pm2 save
```

If already running:
```bash
PORT=3000 pm2 restart giglet --update-env
```

## Security Group Verification
- EC2 SG inbound: allow TCP `3000`
- RDS SG inbound: allow TCP `5432` only from the EC2 SG

## Troubleshooting
- App not reachable: `pm2 list` and `pm2 logs giglet`
- Auth redirect issues: verify `AUTH_URL` and `trustHost: true`
- DB errors: ensure `pnpm exec prisma db push` succeeded and RDS is reachable from EC2
