// Firebase Data Service for Starflix
// Handles all Firestore operations for user data

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const dataService = {
  // User Profile Operations
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Watchlist Operations
  async addToWatchlist(userId, movieData) {
    try {
      // Try Firestore first - use movie ID as document ID
      const watchlistRef = doc(db, 'users', userId, 'watchlist', movieData.id.toString());
      await setDoc(watchlistRef, {
        ...movieData,
        addedAt: serverTimestamp(),
        type: movieData.media_type || 'movie'
      });
      console.log('✅ Added to Firestore watchlist');
      return { success: true };
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_watchlist_${userId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newItem = {
          ...movieData,
          addedAt: new Date().toISOString(),
          type: movieData.media_type || 'movie',
          id: movieData.id
        };
        
        // Check if already exists
        if (!existing.find(item => item.id === movieData.id)) {
          existing.push(newItem);
          localStorage.setItem(key, JSON.stringify(existing));
          console.log('✅ Added to localStorage watchlist');
        }
        
        return { success: true };
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        throw new Error('Failed to save to watchlist. Please check your browser settings.');
      }
    }
  },

  async removeFromWatchlist(userId, movieId) {
    try {
      // Try Firestore first
      const watchlistRef = collection(db, 'users', userId, 'watchlist');
      const q = query(watchlistRef, where('id', '==', movieId));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });
      
      console.log('✅ Removed from Firestore watchlist');
      return { success: true };
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_watchlist_${userId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.filter(item => item.id !== movieId);
        localStorage.setItem(key, JSON.stringify(updated));
        console.log('✅ Removed from localStorage watchlist');
        return { success: true };
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        throw new Error('Failed to remove from watchlist. Please try again.');
      }
    }
  },

  async getWatchlist(userId) {
    try {
      // Try Firestore first
      const watchlistRef = collection(db, 'users', userId, 'watchlist');
      const q = query(watchlistRef, orderBy('addedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const firestoreData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('✅ Retrieved from Firestore watchlist');
      return firestoreData;
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_watchlist_${userId}`;
        const localStorageData = JSON.parse(localStorage.getItem(key) || '[]');
        console.log('✅ Retrieved from localStorage watchlist');
        return localStorageData;
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        return [];
      }
    }
  },

  async isInWatchlist(userId, movieId) {
    try {
      // Try Firestore first
      const watchlistRef = collection(db, 'users', userId, 'watchlist');
      const q = query(watchlistRef, where('id', '==', movieId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_watchlist_${userId}`;
        const localStorageData = JSON.parse(localStorage.getItem(key) || '[]');
        return localStorageData.some(item => item.id === movieId);
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        return false;
      }
    }
  },

  // Favourites Operations
  async addToFavourites(userId, movieData) {
    try {
      // Try Firestore first - use movie ID as document ID
      const favouritesRef = doc(db, 'users', userId, 'favourites', movieData.id.toString());
      await setDoc(favouritesRef, {
        ...movieData,
        addedAt: serverTimestamp(),
        type: movieData.media_type || 'movie'
      });
      console.log('✅ Added to Firestore favourites');
      return { success: true };
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_favourites_${userId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newItem = {
          ...movieData,
          addedAt: new Date().toISOString(),
          type: movieData.media_type || 'movie',
          id: movieData.id
        };
        
        // Check if already exists
        if (!existing.find(item => item.id === movieData.id)) {
          existing.push(newItem);
          localStorage.setItem(key, JSON.stringify(existing));
          console.log('✅ Added to localStorage favourites');
        }
        
        return { success: true };
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        throw new Error('Failed to save to favourites. Please check your browser settings.');
      }
    }
  },

  async removeFromFavourites(userId, movieId) {
    try {
      // Try Firestore first
      const favouritesRef = collection(db, 'users', userId, 'favourites');
      const q = query(favouritesRef, where('id', '==', movieId));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });
      
      console.log('✅ Removed from Firestore favourites');
      return { success: true };
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_favourites_${userId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.filter(item => item.id !== movieId);
        localStorage.setItem(key, JSON.stringify(updated));
        console.log('✅ Removed from localStorage favourites');
        return { success: true };
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        throw new Error('Failed to remove from favourites. Please try again.');
      }
    }
  },

  async getFavourites(userId) {
    try {
      // Try Firestore first
      const favouritesRef = collection(db, 'users', userId, 'favourites');
      const q = query(favouritesRef, orderBy('addedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const firestoreData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('✅ Retrieved from Firestore favourites');
      return firestoreData;
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_favourites_${userId}`;
        const localStorageData = JSON.parse(localStorage.getItem(key) || '[]');
        console.log('✅ Retrieved from localStorage favourites');
        return localStorageData;
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        return [];
      }
    }
  },

  async isFavourite(userId, movieId) {
    try {
      // Try Firestore first
      const favouritesRef = collection(db, 'users', userId, 'favourites');
      const q = query(favouritesRef, where('id', '==', movieId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Firestore error, trying localStorage:', error);
      
      // Fallback to localStorage
      try {
        const key = `starflix_favourites_${userId}`;
        const localStorageData = JSON.parse(localStorage.getItem(key) || '[]');
        return localStorageData.some(item => item.id === movieId);
      } catch (localError) {
        console.error('❌ localStorage error:', localError);
        return false;
      }
    }
  },

  // Reviews Operations
  async addReview(userId, movieData, reviewData) {
    try {
      const reviewsRef = collection(db, 'users', userId, 'reviews');
      await addDoc(reviewsRef, {
        ...movieData,
        ...reviewData,
        createdAt: serverTimestamp(),
        type: movieData.media_type || 'movie'
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  async updateReview(userId, reviewId, reviewData) {
    try {
      const reviewRef = doc(db, 'users', userId, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        ...reviewData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  async deleteReview(userId, reviewId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'reviews', reviewId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  async getReviews(userId) {
    try {
      const reviewsRef = collection(db, 'users', userId, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  },

  // Viewing History Operations
  async addToHistory(userId, movieData) {
    try {
      const historyRef = collection(db, 'users', userId, 'history');
      await addDoc(historyRef, {
        ...movieData,
        watchedAt: serverTimestamp(),
        type: movieData.media_type || 'movie'
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  },

  async getHistory(userId, limitCount = 20) {
    try {
      const historyRef = collection(db, 'users', userId, 'history');
      const q = query(historyRef, orderBy('watchedAt', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting history:', error);
      throw error;
    }
  },

  // Statistics Operations
  async getUserStats(userId) {
    try {
      const [watchlist, favourites, reviews, history] = await Promise.all([
        this.getWatchlist(userId),
        this.getFavourites(userId),
        this.getReviews(userId),
        this.getHistory(userId, 100)
      ]);

      return {
        watchlistCount: watchlist.length,
        favouritesCount: favourites.length,
        reviewsCount: reviews.length,
        historyCount: history.length,
        totalWatchTime: this.calculateWatchTime(history)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  },

  calculateWatchTime(history) {
    // Calculate total watch time based on movie durations
    return history.reduce((total, item) => {
      return total + (item.runtime || 0);
    }, 0);
  }
};
