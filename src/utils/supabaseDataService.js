// Supabase Data Service for Starflix
// Handles all database operations for user data

import { supabase } from '../database/supabase.js';

export const supabaseDataService = {
  // Initialize Supabase connection
  async init() {
    try {
      console.log('✅ Supabase Data Service initialized');
      return true;
    } catch (error) {
      console.error('❌ Supabase Data Service initialization failed:', error);
      throw error;
    }
  },

  // User Operations
  async createOrUpdateUser(firebaseId, userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          firebase_id: firebaseId,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      console.log('✅ User created/updated:', data.email);
      return data;
    } catch (error) {
      console.error('❌ Error creating/updating user:', error);
      throw error;
    }
  },

  async getUserByFirebaseId(firebaseId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_id', firebaseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  },

  // Favourites Operations
  async addToFavourites(firebaseId, movieData) {
    try {
      // Get or create user
      const user = await this.createOrUpdateUser(firebaseId, {
        email: 'temp@example.com',
        name: 'User'
      });

      // Check if movie already exists
      const { data: existing, error: checkError } = await supabase
        .from('favourites')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movieData.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (!existing) {
        // Add new favourite
        const { data, error } = await supabase
          .from('favourites')
          .insert({
            user_id: user.id,
            movie_id: movieData.id,
            title: movieData.title || movieData.name,
            name: movieData.name,
            poster_path: movieData.poster_path,
            backdrop_path: movieData.backdrop_path,
            release_date: movieData.release_date,
            first_air_date: movieData.first_air_date,
            vote_average: movieData.vote_average,
            overview: movieData.overview,
            genre_ids: movieData.genre_ids,
            media_type: movieData.media_type || 'movie'
          })
          .select()
          .single();

        if (error) throw error;
        console.log('✅ Added to favourites:', movieData.title || movieData.name);
      } else {
        console.log('⚠️ Movie already in favourites');
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding to favourites:', error);
      throw error;
    }
  },

  async removeFromFavourites(firebaseId, movieId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;
      console.log('✅ Removed from favourites:', movieId);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error removing from favourites:', error);
      throw error;
    }
  },

  async getFavourites(firebaseId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) return [];

      const { data, error } = await supabase
        .from('favourites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to the format expected by the frontend
      return data.map(movie => ({
        id: movie.movie_id,
        title: movie.title,
        name: movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        first_air_date: movie.first_air_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
        genre_ids: movie.genre_ids,
        media_type: movie.media_type,
        addedAt: movie.created_at
      }));
    } catch (error) {
      console.error('❌ Error getting favourites:', error);
      return [];
    }
  },

  async isFavourite(firebaseId, movieId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) return false;

      const { data, error } = await supabase
        .from('favourites')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('❌ Error checking favourite status:', error);
      return false;
    }
  },

  // Watchlist Operations
  async addToWatchlist(firebaseId, movieData) {
    try {
      // Get or create user
      const user = await this.createOrUpdateUser(firebaseId, {
        email: 'temp@example.com',
        name: 'User'
      });

      // Check if movie already exists
      const { data: existing, error: checkError } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movieData.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (!existing) {
        // Add new watchlist item
        const { data, error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            movie_id: movieData.id,
            title: movieData.title || movieData.name,
            name: movieData.name,
            poster_path: movieData.poster_path,
            backdrop_path: movieData.backdrop_path,
            release_date: movieData.release_date,
            first_air_date: movieData.first_air_date,
            vote_average: movieData.vote_average,
            overview: movieData.overview,
            genre_ids: movieData.genre_ids,
            media_type: movieData.media_type || 'movie'
          })
          .select()
          .single();

        if (error) throw error;
        console.log('✅ Added to watchlist:', movieData.title || movieData.name);
      } else {
        console.log('⚠️ Movie already in watchlist');
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(firebaseId, movieId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;
      console.log('✅ Removed from watchlist:', movieId);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error removing from watchlist:', error);
      throw error;
    }
  },

  async getWatchlist(firebaseId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) return [];

      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to the format expected by the frontend
      return data.map(movie => ({
        id: movie.movie_id,
        title: movie.title,
        name: movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        first_air_date: movie.first_air_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
        genre_ids: movie.genre_ids,
        media_type: movie.media_type,
        addedAt: movie.created_at
      }));
    } catch (error) {
      console.error('❌ Error getting watchlist:', error);
      return [];
    }
  },

  async isInWatchlist(firebaseId, movieId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) return false;

      const { data, error } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('❌ Error checking watchlist status:', error);
      return false;
    }
  },

  // Reviews Operations
  async addReview(firebaseId, reviewData) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          movie_id: reviewData.movieId,
          movie_title: reviewData.movieTitle,
          movie_poster: reviewData.moviePoster,
          rating: reviewData.rating,
          review_text: reviewData.reviewText
        })
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Review added:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw error;
    }
  },

  async getReviews(firebaseId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(review => ({
        id: review.id,
        movieId: review.movie_id,
        movieTitle: review.movie_title,
        moviePoster: review.movie_poster,
        rating: review.rating,
        reviewText: review.review_text,
        createdAt: review.created_at
      }));
    } catch (error) {
      console.error('❌ Error getting reviews:', error);
      return [];
    }
  },

  async deleteReview(firebaseId, reviewId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
      console.log('✅ Review deleted:', reviewId);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  }
};






