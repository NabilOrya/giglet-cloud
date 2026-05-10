# Giglet Deployment Guide — AWS EC2 (Standalone Mode)

This document provides instructions for deploying the Giglet Phase 1 application to an AWS EC2 instance (Private Subnet) behind an Application Load Balancer (ALB).

## Prerequisites
- EC2 Instance (Ubuntu/Linux) in Private Subnet.
- RDS PostgreSQL instance accessible from EC2.
- ALB configured with a Target Group pointing to EC2 on Port 3000.
- Node.js 20+ (LTS) installed on EC2.
- PM2 installed on EC2 (`npm install -g pm2`).

## Step 1: Prepare the Production Bundle
On your local machine, run:
```bash
pnpm build
```
This generates the standalone bundle in `.next/standalone`.

## Step 2: Transfer Files to EC2
Transfer the following files/directories to your EC2 instance (e.g., using SCP or SFTP):
- `.next/standalone/` (All contents)
- `.next/static/` (Transfer to `.next/standalone/.next/static`)
- `public/` (Transfer to `.next/standalone/public`)
- `prisma/` (Required for database migrations)

## Step 3: Environment Configuration
On the EC2 instance, create a `.env` file inside the application directory:

```env
# Database (RDS)
DATABASE_URL="postgresql://<username>:<password>@<rds-endpoint>:5432/<db-name>?schema=public"

# Auth.js (Production)
AUTH_SECRET="<your-generate-secret>"
AUTH_URL="https://<your-alb-domain-or-ip>" # Must match the ALB entry point

# AWS Specific
TRUST_HOST=true
```

## Step 4: Install Production Dependencies
Navigate to the app directory on EC2 and run:
```bash
# Since it's standalone, most dependencies are bundled.
# We only need to ensure the Prisma client is generated if not transferred.
npx prisma generate
```

## Step 5: Start the Application with PM2
Start the server using PM2 to ensure it stays alive:
```bash
pm2 start server.js --name "giglet-app" --env PORT=3000
```

## Step 6: ALB & Security Group Verification
- **ALB Security Group**: Allow 80/443 from 0.0.0.0/0.
- **EC2 Security Group**: Allow Port 3000 ONLY from the ALB Security Group.
- **RDS Security Group**: Allow Port 5432 ONLY from the EC2 Security Group.

## Troubleshooting
- **502 Bad Gateway**: Check if the app is running (`pm2 list`) and listening on Port 3000.
- **Auth Redirects**: Ensure `AUTH_URL` is set to the ALB's domain and `trustHost: true` is in your Auth.js config.
- **Database Connection**: Verify EC2 can reach RDS (`telnet <rds-endpoint> 5432`).
