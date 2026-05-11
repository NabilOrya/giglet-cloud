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
Paste and update the following values:
```env
# Database connection to RDS
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<RDS_ENDPOINT>:5432/giglet?schema=public"

# Auth.js Config
# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-generated-secret"
AUTH_URL="http://44.197.216.71:3000"

# Production specific
NODE_ENV="production"
PORT=3000
```

## 4. Database Sync
Ensure your RDS schema is up to date:
```bash
# Generate Prisma Client
pnpm exec prisma generate

# Push schema to RDS (Use this for first-time setup)
pnpm exec prisma db push
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
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Start the application
PORT=3000 pm2 start .next/standalone/server.js --name "giglet" --update-env --time --interpreter node --env production

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

# Health endpoint
curl -i http://127.0.0.1:3000/health
```

The app is now running on port `3000`. Open it in your browser at `http://44.197.216.71:3000/`.
