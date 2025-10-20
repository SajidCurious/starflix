# 🍃 MongoDB Atlas Setup Guide for Starflix

## Quick Setup Steps:

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/atlas
- Click "Try Free" and sign up
- Use Google/GitHub for faster signup

### 2. Create Cluster
- Choose "FREE" tier (M0 Sandbox)
- Select any cloud provider (AWS/Google/Azure)
- Choose region closest to you
- Cluster name: `starflix-cluster`
- Click "Create Cluster"

### 3. Database Access
- Go to "Database Access" → "Add New Database User"
- Username: `starflix-user`
- Password: Generate secure password (SAVE IT!)
- Privileges: "Read and write to any database"
- Click "Add User"

### 4. Network Access
- Go to "Network Access" → "Add IP Address"
- Choose "Allow Access from Anywhere" (for development)
- Click "Confirm"

### 5. Get Connection String
- Go to "Clusters" → Click "Connect"
- Choose "Connect your application"
- Driver: Node.js, Version: 4.1+
- Copy the connection string

### 6. Update Your App
- Open `src/config/mongodb-config.js`
- Replace the connectionString with your actual Atlas connection string
- Make sure to replace `YOUR_PASSWORD` with your actual password

### 7. Test Connection
- Restart your dev server: `npm run dev`
- Go to Personal page → Click "🔍 Debug MongoDB Atlas"
- Check console for connection logs

## Example Connection String:
```
mongodb+srv://starflix-user:yourpassword@starflix-cluster.xxxxx.mongodb.net/starflix?retryWrites=true&w=majority
```

## What You Should See:
- ✅ Connected to MongoDB Atlas successfully
- ✅ MongoDB Data Service initialized
- ✅ Test query successful

Your favourites and watchlist will now be stored in MongoDB Atlas cloud database! 🍃✨




