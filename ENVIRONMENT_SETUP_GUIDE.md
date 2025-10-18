# Environment Variables Setup Guide

## 📁 Files Created

1. **`import.env`** - Contains all your API keys and secrets
2. **`.gitignore`** - Updated to ignore `.env` files

## 🔧 Local Development Setup

### Step 1: Create .env file
```bash
# Copy the import.env file to .env
cp import.env .env
```

### Step 2: Install dotenv (if not already installed)
```bash
npm install dotenv
```

### Step 3: Load environment variables
Make sure your server.js loads the environment variables:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

## 🌐 Vercel Deployment Setup

### Add these environment variables to Vercel:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your Starflix project
   - Go to **Settings** → **Environment Variables**

2. **Add each variable:**

```
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster

VITE_FIREBASE_API_KEY=AIzaSyD_Kjye43E69b-KMsM9jYcRNIvVzvbYv-o
VITE_FIREBASE_AUTH_DOMAIN=starflix-auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=starflix-auth
VITE_FIREBASE_STORAGE_BUCKET=starflix-auth.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=724390243085
VITE_FIREBASE_APP_ID=1:724390243085:web:e17160297d357e44449e44
VITE_FIREBASE_MEASUREMENT_ID=G-EJ741SXGBN

VITE_TMDB_API_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzczZTAyYTZlZDdmMDM0NzEzNzI5MDA3MWEwYzEyOSIsIm5iZiI6MTc1NzQ3MzQzMC4wMzMsInN1YiI6IjY4YzBlYTk2MDQ1OWUzN2YxNzFiZDg2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jTYzse9lXmqdCGDDu6aTHm5l1YMTb4QWx8WGDcFt7R0

PORT=5000
NODE_ENV=production
```

## 🔒 Security Features

✅ **API Keys Protected** - No longer in source code  
✅ **Git Ignored** - `.env` files won't be committed  
✅ **Environment Specific** - Different values for dev/prod  
✅ **Easy Management** - Update keys without code changes  

## 🚨 Important Notes

- **Never commit `.env` files** to version control
- **Always use environment variables** in production
- **Keep `import.env` as a template** for team members
- **Update Vercel variables** when keys change

## 🧪 Testing

After setting up environment variables:

1. **Local Development:**
   ```bash
   npm run dev
   # Should work with .env file
   ```

2. **Vercel Deployment:**
   - Add all variables to Vercel
   - Redeploy project
   - Test API endpoints

## 🔍 Troubleshooting

- **API 401 Errors:** Check if TMDB token is set correctly
- **Firebase Errors:** Verify Firebase environment variables
- **MongoDB Errors:** Check MongoDB URI format
- **404 API Errors:** Ensure vercel.json is configured properly
