// Real Authentication service for Starflix using Firebase
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Email/Password Authentication
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName || email.split('@')[0],
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
          loginMethod: 'email'
        }
      };
    } catch (error) {
      console.error('Email login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Google OAuth Authentication
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Try to save user data to Firestore (optional)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          loginMethod: 'google',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (firestoreError) {
        console.warn('Firestore save failed:', firestoreError);
        // Continue even if Firestore fails
      }
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`,
          loginMethod: 'google'
        }
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // User Registration
  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: displayName || email.split('@')[0]
      });
      
      // Try to save user data to Firestore (optional)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: displayName || email.split('@')[0],
          email: user.email,
          avatar: `https://ui-avatars.com/api/?name=${displayName || email.split('@')[0]}&background=random`,
          loginMethod: 'email',
          createdAt: new Date().toISOString()
        });
      } catch (firestoreError) {
        console.warn('Firestore save failed:', firestoreError);
        // Continue even if Firestore fails
      }
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: displayName || email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${displayName || email.split('@')[0]}&background=random`,
          loginMethod: 'email'
        }
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('starflix_user');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  },

  // Listen to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Error message handler
  getErrorMessage(errorCode) {
    console.error('Auth error code:', errorCode);
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Login was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by browser. Please allow popups and try again.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support.';
      default:
        return `Authentication failed: ${errorCode}. Please try again.`;
    }
  }
};
