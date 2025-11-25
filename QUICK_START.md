# Quick Start Guide - Fix MongoDB Connection Error

## The Problem

If you see this error:
```
connect ECONNREFUSED 127.0.0.1:27017
```

**MongoDB is not running on your computer.**

## Quick Solutions

### Option 1: Install MongoDB Locally (5 minutes)

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: **Windows x64** → **Download**

2. **Install**
   - Run the downloaded `.msi` file
   - Click "Next" through the installer
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (optional but helpful)
   - Click "Install"

3. **Verify It's Running**
   - Open PowerShell and run:
     ```powershell
     Get-Service -Name MongoDB
     ```
   - You should see "Running" status

4. **Test the Connection**
   - Restart your Next.js dev server: `npm run dev`
   - Visit: http://localhost:3000/api/v1/test/db
   - You should see connection details

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. **Sign Up for Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create Free Cluster** (Takes 3-5 minutes)
   - Click "Build a Database"
   - Choose **FREE** tier (M0)
   - Select any cloud provider/region
   - Click "Create"

3. **Create Database User**
   - Click "Database Access"
   - "Add New Database User"
   - Username: `finman-user`
   - Password: Click "Autogenerate Secure Password" (save it!)
   - Click "Add User"

4. **Allow Network Access**
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your generated password

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://finman-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/finman?retryWrites=true&w=majority
   ```

7. **Test**
   - Restart your dev server
   - Visit: http://localhost:3000/api/v1/test/db

## Which Option Should I Choose?

- **Local MongoDB (Option 1)**: Best for development, works offline
- **MongoDB Atlas (Option 2)**: Best if you don't want to install anything, works from anywhere

## Still Having Issues?

See the full [MongoDB Setup Guide](Documentation/MONGODB_SETUP.md) for detailed troubleshooting.

