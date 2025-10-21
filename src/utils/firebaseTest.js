// Simple Firebase test to check if Firestore is working
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebase = async (userId) => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test writing to Firestore
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, {
      message: 'Firebase is working!',
      timestamp: new Date().toISOString(),
      userId: userId
    });
    console.log('✅ Successfully wrote to Firestore');
    
    // Test reading from Firestore
    const testDoc = await getDoc(testRef);
    if (testDoc.exists()) {
      console.log('✅ Successfully read from Firestore:', testDoc.data());
    } else {
      console.log('❌ Document does not exist');
    }
    
    return { success: true, data: testDoc.data() };
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};





