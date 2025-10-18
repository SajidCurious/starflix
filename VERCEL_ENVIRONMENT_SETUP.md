# Vercel Environment Variables Setup Guide

## Required Environment Variables

Add these environment variables to your Vercel project:

### 1. MongoDB Atlas Configuration
```
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
```

### 2. Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyD_Kjye43E69b-KMsM9jYcRNIvVzvbYv-o
VITE_FIREBASE_AUTH_DOMAIN=starflix-auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=starflix-auth
VITE_FIREBASE_STORAGE_BUCKET=starflix-auth.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=724390243085
VITE_FIREBASE_APP_ID=1:724390243085:web:e17160297d357e44449e44
VITE_FIREBASE_MEASUREMENT_ID=G-EJ741SXGBN
```

### 3. TMDB API Configuration
```
VITE_TMDB_API_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzczZTAyYTZlZDdmMDM0NzEzNzI5MDA3MWEwYzEyOSIsIm5iZiI6MTc1NzQ3MzQzMC4wMzMsInN1YiI6IjY4YzBlYTk2MDQ1OWUzN2YxNzFiZDg2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jTYzse9lXmqdCGDDu6aTHm5l1YMTb4QWx8WGDcFt7R0
```

### 4. Server Configuration
```
PORT=5000
NODE_ENV=production
```

## How to Add Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your Starflix project

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Environment Variables** in the sidebar

3. **Add Each Variable**
   - Click **Add New**
   - Enter the **Name** (e.g., `MONGODB_URI`)
   - Enter the **Value** (copy from above)
   - Select **Environment**: Production, Preview, Development (or all)
   - Click **Save**

4. **Repeat for All Variables**
   - Add all 9 environment variables listed above
   - Make sure to copy the exact values

5. **Redeploy**
   - After adding all variables, redeploy your project
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment

## Security Benefits

✅ **API Keys Protected** - No longer exposed in source code
✅ **Environment Specific** - Different values for dev/prod
✅ **Easy Management** - Update keys without code changes
✅ **Team Collaboration** - Share project without sharing keys
✅ **Version Control Safe** - Keys not committed to Git

## Local Development

For local development, create a `.env` file in your project root:

```bash
# Copy env.example to .env
cp env.example .env

# Edit .env with your actual values
# The .env file is already in .gitignore
```

## Verification

After setting up environment variables:

1. **Check Vercel Logs** - Look for successful MongoDB connection
2. **Test API Endpoints** - Verify `/api/health` works
3. **Test Authentication** - Try login/signup
4. **Check Console** - No more API key errors

## Troubleshooting

- **Missing Variables**: Check Vercel Environment Variables page
- **Wrong Values**: Verify exact copy-paste of values
- **Deployment Issues**: Redeploy after adding variables
- **API Errors**: Check Vercel function logs for details
