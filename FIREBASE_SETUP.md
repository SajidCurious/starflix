# Firebase Setup Guide for Starflix Authentication

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `starflix-auth` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click and toggle "Enable", add your project support email

### Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with nickname: `starflix-web`
5. Copy the Firebase configuration object

### Step 4: Update Configuration File
Replace the placeholder values in `src/firebase/config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### Step 5: Set Up Firestore Database
1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### Step 6: Configure Security Rules (Optional)
In Firestore Database > Rules, you can set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Testing Authentication

### Test Email/Password Login:
1. Run your app: `npm run dev`
2. Click the account icon in the header
3. Try signing up with a new email/password
4. Try logging in with existing credentials

### Test Google Login:
1. Click "Continue with Google" button
2. Complete Google OAuth flow
3. User should be logged in automatically

## 🔧 Features Implemented:

✅ **Email/Password Authentication**
- User registration with name, email, password
- User login with email/password
- Form validation and error handling
- Password strength requirements

✅ **Google OAuth Authentication**
- One-click Google login
- Automatic user profile creation
- Google profile picture and name integration

✅ **User Management**
- Persistent login sessions
- Automatic logout on token expiry
- User profile data storage in Firestore
- Real-time authentication state updates

✅ **Error Handling**
- Comprehensive error messages
- Network error handling
- User-friendly error display

## 📱 Ready to Use!

Once you've completed the Firebase setup, your Starflix app will have:
- Real email/password authentication
- Google OAuth integration
- Persistent user sessions
- User profile management
- Secure data storage

The authentication system is now production-ready and will work seamlessly with your Starflix movie application!

