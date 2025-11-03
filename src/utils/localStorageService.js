// Simple localStorage-only service for immediate functionality
// This bypasses Firebase completely to ensure favourites work

export const localStorageService = {
  // Get user's favourites
  getFavourites(userId) {
    try {
      const key = `starflix_favourites_${userId}`;
      const data = localStorage.getItem(key);
      const favourites = data ? JSON.parse(data) : [];
      console.log('📱 localStorage - Retrieved favourites:', favourites.length, 'items');
      return favourites;
    } catch (error) {
      console.error('❌ Error getting favourites from localStorage:', error);
      return [];
    }
  },

  // Add movie to favourites
  addToFavourites(userId, movieData) {
    try {
      const key = `starflix_favourites_${userId}`;
      const existing = this.getFavourites(userId);
      
      // Check if already exists
      if (!existing.find(item => item.id === movieData.id)) {
        const newItem = {
          id: movieData.id,
          title: movieData.title || movieData.name,
          name: movieData.name,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          first_air_date: movieData.first_air_date,
          vote_average: movieData.vote_average,
          overview: movieData.overview,
          genre_ids: movieData.genre_ids,
          media_type: movieData.media_type || 'movie',
          addedAt: new Date().toISOString()
        };
        
        existing.push(newItem);
        localStorage.setItem(key, JSON.stringify(existing));
        console.log('✅ localStorage - Added to favourites:', newItem.title);
        return { success: true };
      } else {
        console.log('⚠️ Movie already in favourites');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Error adding to favourites:', error);
      throw error;
    }
  },

  // Remove movie from favourites
  removeFromFavourites(userId, movieId) {
    try {
      const key = `starflix_favourites_${userId}`;
      const existing = this.getFavourites(userId);
      const updated = existing.filter(item => item.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ localStorage - Removed from favourites:', movieId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error removing from favourites:', error);
      throw error;
    }
  },

  // Check if movie is in favourites
  isFavourite(userId, movieId) {
    try {
      const favourites = this.getFavourites(userId);
      return favourites.some(item => item.id === movieId);
    } catch (error) {
      console.error('❌ Error checking favourite status:', error);
      return false;
    }
  },

  // Get user's watchlist
  getWatchlist(userId) {
    try {
      const key = `starflix_watchlist_${userId}`;
      const data = localStorage.getItem(key);
      const watchlist = data ? JSON.parse(data) : [];
      console.log('📱 localStorage - Retrieved watchlist:', watchlist.length, 'items');
      return watchlist;
    } catch (error) {
      console.error('❌ Error getting watchlist from localStorage:', error);
      return [];
    }
  },

  // Add movie to watchlist
  addToWatchlist(userId, movieData) {
    try {
      const key = `starflix_watchlist_${userId}`;
      const existing = this.getWatchlist(userId);
      
      // Check if already exists
      if (!existing.find(item => item.id === movieData.id)) {
        const newItem = {
          id: movieData.id,
          title: movieData.title || movieData.name,
          name: movieData.name,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          first_air_date: movieData.first_air_date,
          vote_average: movieData.vote_average,
          overview: movieData.overview,
          genre_ids: movieData.genre_ids,
          media_type: movieData.media_type || 'movie',
          addedAt: new Date().toISOString()
        };
        
        existing.push(newItem);
        localStorage.setItem(key, JSON.stringify(existing));
        console.log('✅ localStorage - Added to watchlist:', newItem.title);
        return { success: true };
      } else {
        console.log('⚠️ Movie already in watchlist');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Error adding to watchlist:', error);
      throw error;
    }
  },

  // Remove movie from watchlist
  removeFromWatchlist(userId, movieId) {
    try {
      const key = `starflix_watchlist_${userId}`;
      const existing = this.getWatchlist(userId);
      const updated = existing.filter(item => item.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ localStorage - Removed from watchlist:', movieId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error removing from watchlist:', error);
      throw error;
    }
  },

  // Check if movie is in watchlist
  isInWatchlist(userId, movieId) {
    try {
      const watchlist = this.getWatchlist(userId);
      return watchlist.some(item => item.id === movieId);
    } catch (error) {
      console.error('❌ Error checking watchlist status:', error);
      return false;
    }
  }
};







