// Firebase configuration for Starflix
// Real Firebase project credentials

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_Kjye43E69b-KMsM9jYcRNIvVzvbYv-o",
  authDomain: "starflix-auth.firebaseapp.com",
  projectId: "starflix-auth",
  storageBucket: "starflix-auth.firebasestorage.app",
  messagingSenderId: "724390243085",
  appId: "1:724390243085:web:e17160297d357e44449e44",
  measurementId: "G-EJ741SXGBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
