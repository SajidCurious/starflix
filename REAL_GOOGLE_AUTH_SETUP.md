# 🔥 Real Google OAuth Setup Guide

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "starflix-auth" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Google Authentication
1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google" provider
5. Toggle "Enable"
6. Add your email as "Project support email"
7. Click "Save"

## Step 3: Get Firebase Configuration
1. Click the gear icon (Project Settings) in Firebase Console
2. Scroll to "Your apps" section
3. Click "Add app" → Web icon (</>)
4. Register app with name "starflix-web"
5. Copy the Firebase configuration object

## Step 4: Update Your Config File
Replace the placeholder values in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "starflix-auth.firebaseapp.com", // Your project domain
  projectId: "starflix-auth", // Your project ID
  storageBucket: "starflix-auth.appspot.com", // Your storage bucket
  messagingSenderId: "123456789", // Your sender ID
  appId: "1:123456789:web:abcdef" // Your app ID
};
```

## Step 5: Switch to Real Authentication
After updating the config, change the imports back to real Firebase:

**In these files, change:**
```javascript
// FROM:
import { authService } from "../../utils/authService.mock";

// TO:
import { authService } from "../../utils/authService";
```

**Files to update:**
- `src/components/loginModal/LoginModal.jsx`
- `src/components/userDropdown/UserDropdown.jsx`
- `src/components/header/Header.jsx`

## Step 6: Test Real Google Login
1. Run your app: `npm run dev`
2. Click "Continue with Google"
3. Complete the real Google OAuth flow
4. Users will log in with their actual Google accounts

## 🎯 What Will Happen:
- Users click "Continue with Google"
- Google OAuth popup opens
- Users sign in with their real Google account
- Their actual name, email, and profile picture will be used
- They'll be logged into your Starflix app

## 🔧 Alternative: Quick Setup Script
I can help you set up Firebase quickly if you provide your Firebase project details.

Would you like me to help you with the Firebase setup, or do you have any questions about the process?

