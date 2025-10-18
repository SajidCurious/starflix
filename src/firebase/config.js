// Firebase configuration for Starflix
// Real Firebase project credentials

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_Kjye43E69b-KMsM9jYcRNIvVzvbYv-o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "starflix-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "starflix-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "starflix-auth.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "724390243085",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:724390243085:web:e17160297d357e44449e44",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EJ741SXGBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
