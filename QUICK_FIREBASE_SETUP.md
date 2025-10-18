# 🚨 Firebase Setup Required

The authentication is failing because Firebase isn't configured yet. Here's how to fix it:

## Quick Setup Steps:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "starflix-auth" (or any name you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Email/Password** provider
5. Enable **Google** provider (add your email as support email)

### 3. Get Your Config
1. Click the gear icon (Project Settings)
2. Scroll to "Your apps" section
3. Click "Add app" → Web icon (</>)
4. Register app with name "starflix-web"
5. Copy the config object

### 4. Update Your Config File
Replace the placeholder values in `src/firebase/config.js` with your actual config:

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

### 5. Set Up Firestore (Optional)
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location and click "Done"

## 🔧 Alternative: Test with Mock Data

If you want to test the UI without Firebase setup, I can temporarily revert to mock authentication for testing purposes.

## ✅ After Setup
Once you update the config file, the authentication will work with:
- Real email/password login
- Google OAuth
- Persistent sessions
- User profile management

Would you like me to help you with the Firebase setup, or would you prefer a temporary mock version for testing?

