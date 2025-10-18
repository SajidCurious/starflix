// Firebase Connection Test
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase Auth:', auth);
    console.log('✅ Firebase Firestore:', db);
    
    // Test 2: Check current user
    const currentUser = auth.currentUser;
    console.log('👤 Current user:', currentUser);
    
    if (currentUser) {
      // Test 3: Write to Firestore
      const testRef = doc(db, 'test', 'connection');
      await setDoc(testRef, {
        message: 'Firebase is working!',
        timestamp: new Date().toISOString(),
        userId: currentUser.uid
      });
      console.log('✅ Successfully wrote to Firestore');
      
      // Test 4: Read from Firestore
      const testDoc = await getDoc(testRef);
      if (testDoc.exists()) {
        console.log('✅ Successfully read from Firestore:', testDoc.data());
      }
      
      return { success: true, user: currentUser };
    } else {
      console.log('⚠️ No user logged in');
      return { success: false, error: 'No user logged in' };
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return { success: false, error: error.message };
  }
};



