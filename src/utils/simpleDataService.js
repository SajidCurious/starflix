// Simple localStorage-only service for Starflix
// This will definitely work without any Firebase complications

export const simpleDataService = {
  // Get user's favourites
  getFavourites(userId) {
    try {
      const key = `starflix_favourites_${userId}`;
      const data = localStorage.getItem(key);
      const favourites = data ? JSON.parse(data) : [];
      console.log('✅ Retrieved favourites from localStorage:', favourites);
      return favourites;
    } catch (error) {
      console.error('❌ Error getting favourites:', error);
      return [];
    }
  },

  // Add to favourites
  addToFavourites(userId, movieData) {
    try {
      const key = `starflix_favourites_${userId}`;
      const existing = this.getFavourites(userId);
      
      // Check if already exists
      if (!existing.find(item => item.id === movieData.id)) {
        const newItem = {
          id: movieData.id,
          title: movieData.title,
          name: movieData.name,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          first_air_date: movieData.first_air_date,
          vote_average: movieData.vote_average,
          overview: movieData.overview,
          genre_ids: movieData.genre_ids,
          media_type: movieData.media_type || 'movie',
          addedAt: new Date().toISOString(),
          type: movieData.media_type || 'movie'
        };
        existing.push(newItem);
        localStorage.setItem(key, JSON.stringify(existing));
        console.log('✅ Added to favourites:', newItem);
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

  // Remove from favourites
  removeFromFavourites(userId, movieId) {
    try {
      const key = `starflix_favourites_${userId}`;
      const existing = this.getFavourites(userId);
      const updated = existing.filter(item => item.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('✅ Removed from favourites:', movieId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error removing from favourites:', error);
      throw error;
    }
  },

  // Check if movie is favourite
  isFavourite(userId, movieId) {
    try {
      const favourites = this.getFavourites(userId);
      return favourites.some(item => item.id === movieId);
    } catch (error) {
      console.error('❌ Error checking favourites:', error);
      return false;
    }
  },

  // Get user's watchlist
  getWatchlist(userId) {
    try {
      const key = `starflix_watchlist_${userId}`;
      const data = localStorage.getItem(key);
      const watchlist = data ? JSON.parse(data) : [];
      console.log('✅ Retrieved watchlist from localStorage:', watchlist);
      return watchlist;
    } catch (error) {
      console.error('❌ Error getting watchlist:', error);
      return [];
    }
  },

  // Add to watchlist
  addToWatchlist(userId, movieData) {
    try {
      const key = `starflix_watchlist_${userId}`;
      const existing = this.getWatchlist(userId);
      
      // Check if already exists
      if (!existing.find(item => item.id === movieData.id)) {
        const newItem = {
          id: movieData.id,
          title: movieData.title,
          name: movieData.name,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          first_air_date: movieData.first_air_date,
          vote_average: movieData.vote_average,
          overview: movieData.overview,
          genre_ids: movieData.genre_ids,
          media_type: movieData.media_type || 'movie',
          addedAt: new Date().toISOString(),
          type: movieData.media_type || 'movie'
        };
        existing.push(newItem);
        localStorage.setItem(key, JSON.stringify(existing));
        console.log('✅ Added to watchlist:', newItem);
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

  // Remove from watchlist
  removeFromWatchlist(userId, movieId) {
    try {
      const key = `starflix_watchlist_${userId}`;
      const existing = this.getWatchlist(userId);
      const updated = existing.filter(item => item.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('✅ Removed from watchlist:', movieId);
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
      console.error('❌ Error checking watchlist:', error);
      return false;
    }
  },

  // Get reviews (empty for now)
  getReviews(userId) {
    return [];
  },

  // Delete review (empty for now)
  deleteReview(userId, reviewId) {
    return { success: true };
  }
};
