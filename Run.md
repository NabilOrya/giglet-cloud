# Giglet — EC2 Runtime Execution Guide

Since you have cloned the `giglet-cloud` repository onto your EC2 instance, follow these exact steps to build and run the application in production mode.

## 1. System Requirements Check
Ensure your EC2 has the necessary tools:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS) if not present
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm and pm2
sudo npm install -g pnpm pm2
```

## 2. Project Initialization
Navigate to your project folder:
```bash
cd ~/giglet-cloud

# Install all dependencies
pnpm install
```

## 3. Environment Setup
Create the production `.env` file:
```bash
nano .env
```
Paste and update the following values (replace placeholders with your RDS/ALB details):
```env
# Database connection to RDS
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<RDS_ENDPOINT>:5432/giglet?schema=public"

# Auth.js Config
# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-generated-secret"
# The ALB URL (e.g., https://giglet-alb-12345.us-east-1.elb.amazonaws.com)
AUTH_URL="http://<YOUR_ALB_DNS_OR_DOMAIN>"

# Production specific
NODE_ENV="production"
```

## 4. Database Sync
Ensure your RDS schema is up to date:
```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to RDS (Use this for first-time setup)
npx prisma db push
```

## 5. Build for Production
Run the production build with standalone output:
```bash
pnpm build
```
This will create the `.next/standalone` directory which is optimized for your EC2 instance.

## 6. Run with PM2 (Process Manager)
To ensure the app stays running even after you close the terminal:

```bash
# Copy static files to the standalone directory
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Start the application
pm2 start .next/standalone/server.js --name "giglet" --env PORT=3000

# Save PM2 process list to restart on reboot
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 7. Verification
Check if the app is healthy:
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs giglet
```

The app is now running on `localhost:3000` inside your EC2. Your **ALB** should be configured to forward traffic from port 80/443 to this EC2 instance on port 3000.
