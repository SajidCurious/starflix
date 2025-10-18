// API Data Service for Starflix MongoDB Atlas integration
// This service communicates with the backend API

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'  // Use localhost for development
  : '/api';  // Use relative URL for production (Vercel)

export const apiDataService = {
  // Helper function to make API calls
  async apiCall(endpoint, options = {}) {
    try {
      console.log('🔍 API Call:', `${API_BASE_URL}${endpoint}`, options);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      console.log('🔍 API Response:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔍 API Data:', data);
      return data;
    } catch (error) {
      console.error('❌ API call error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        endpoint: `${API_BASE_URL}${endpoint}`,
        options
      });
      throw error;
    }
  },

  // User Operations
  async createOrUpdateUser(firebaseId, userData) {
    try {
      const result = await this.apiCall('/user', {
        method: 'POST',
        body: JSON.stringify({
          firebaseId,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        })
      });
      return result.user;
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  // Favourites Operations
  async addToFavourites(firebaseId, movieData, userData = {}) {
    try {
      const result = await this.apiCall(`/favourites/${firebaseId}`, {
        method: 'POST',
        body: JSON.stringify({
          movieData,
          userData
        })
      });
      console.log('✅ Added to favourites via API:', movieData.title || movieData.name);
      return result;
    } catch (error) {
      console.error('❌ Error adding to favourites:', error);
      throw error;
    }
  },

  async removeFromFavourites(firebaseId, movieId) {
    try {
      const result = await this.apiCall(`/favourites/${firebaseId}/${movieId}`, {
        method: 'DELETE'
      });
      console.log('✅ Removed from favourites via API:', movieId);
      return result;
    } catch (error) {
      console.error('❌ Error removing from favourites:', error);
      throw error;
    }
  },

  async getFavourites(firebaseId) {
    try {
      const result = await this.apiCall(`/favourites/${firebaseId}`);
      return result.favourites || [];
    } catch (error) {
      console.error('❌ Error getting favourites:', error);
      return [];
    }
  },

  async isFavourite(firebaseId, movieId) {
    try {
      const favourites = await this.getFavourites(firebaseId);
      return favourites.some(movie => movie.id === movieId);
    } catch (error) {
      console.error('❌ Error checking favourite status:', error);
      return false;
    }
  },

  // Watchlist Operations
  async addToWatchlist(firebaseId, movieData, userData = {}) {
    try {
      const result = await this.apiCall(`/watchlist/${firebaseId}`, {
        method: 'POST',
        body: JSON.stringify({
          movieData,
          userData
        })
      });
      console.log('✅ Added to watchlist via API:', movieData.title || movieData.name);
      return result;
    } catch (error) {
      console.error('❌ Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(firebaseId, movieId) {
    try {
      const result = await this.apiCall(`/watchlist/${firebaseId}/${movieId}`, {
        method: 'DELETE'
      });
      console.log('✅ Removed from watchlist via API:', movieId);
      return result;
    } catch (error) {
      console.error('❌ Error removing from watchlist:', error);
      throw error;
    }
  },

  async getWatchlist(firebaseId) {
    try {
      const result = await this.apiCall(`/watchlist/${firebaseId}`);
      return result.watchlist || [];
    } catch (error) {
      console.error('❌ Error getting watchlist:', error);
      return [];
    }
  },

  async isInWatchlist(firebaseId, movieId) {
    try {
      const watchlist = await this.getWatchlist(firebaseId);
      return watchlist.some(movie => movie.id === movieId);
    } catch (error) {
      console.error('❌ Error checking watchlist status:', error);
      return false;
    }
  },

  // Reviews Operations
  async addReview(firebaseId, reviewData, userData = {}) {
    try {
      const result = await this.apiCall(`/reviews/${firebaseId}`, {
        method: 'POST',
        body: JSON.stringify({
          reviewData,
          userData
        })
      });
      console.log('✅ Review added via API:', result.review._id);
      return result.review;
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw error;
    }
  },

  async getReviews(firebaseId) {
    try {
      const result = await this.apiCall(`/reviews/${firebaseId}`);
      return result.reviews || [];
    } catch (error) {
      console.error('❌ Error getting reviews:', error);
      return [];
    }
  },

  async updateReview(firebaseId, reviewId, reviewData) {
    try {
      const result = await this.apiCall(`/reviews/${firebaseId}/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({
          rating: reviewData.rating,
          reviewText: reviewData.reviewText
        })
      });
      console.log('✅ Review updated via API:', reviewId);
      return result.review;
    } catch (error) {
      console.error('❌ Error updating review:', error);
      throw error;
    }
  },

  async deleteReview(firebaseId, reviewId) {
    try {
      const result = await this.apiCall(`/reviews/${firebaseId}/${reviewId}`, {
        method: 'DELETE'
      });
      console.log('✅ Review deleted via API:', reviewId);
      return result;
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  },

  async hasReviewed(firebaseId, movieId) {
    try {
      const reviews = await this.getReviews(firebaseId);
      return reviews.some(review => review.movieId === movieId);
    } catch (error) {
      console.error('❌ Error checking review status:', error);
      return false;
    }
  },

  // Health check
  async checkHealth() {
    try {
      const result = await this.apiCall('/health');
      console.log('✅ API Health check:', result.message);
      return result;
    } catch (error) {
      console.error('❌ API Health check failed:', error);
      throw error;
    }
  }
};
