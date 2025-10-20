// MongoDB Data Service for Starflix
// Handles all MongoDB operations for user data

import { connectToMongoDB } from '../database/mongodb.js';
import { User, Favourites, Watchlist, Review } from '../database/schemas.js';

export const mongoDataService = {
  // Initialize MongoDB connection
  async init() {
    try {
      await connectToMongoDB();
      console.log('✅ MongoDB Data Service initialized');
    } catch (error) {
      console.error('❌ MongoDB Data Service initialization failed:', error);
      throw error;
    }
  },

  // User Operations
  async createOrUpdateUser(firebaseId, userData) {
    try {
      const user = await User.findOneAndUpdate(
        { firebaseId },
        {
          firebaseId,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        },
        { upsert: true, new: true }
      );
      console.log('✅ User created/updated:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Error creating/updating user:', error);
      throw error;
    }
  },

  async getUserByFirebaseId(firebaseId) {
    try {
      const user = await User.findOne({ firebaseId });
      return user;
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
        email: 'temp@example.com', // Will be updated by auth
        name: 'User'
      });

      // Check if movie already exists
      const existingFavourites = await Favourites.findOne({ userId: user._id });
      
      if (existingFavourites) {
        // Check if movie already in favourites
        const movieExists = existingFavourites.movies.some(movie => movie.movieId === movieData.id);
        
        if (!movieExists) {
          existingFavourites.movies.push({
            movieId: movieData.id,
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
          });
          existingFavourites.updatedAt = new Date();
          await existingFavourites.save();
          console.log('✅ Added to favourites:', movieData.title || movieData.name);
        } else {
          console.log('⚠️ Movie already in favourites');
        }
      } else {
        // Create new favourites document
        await Favourites.create({
          userId: user._id,
          movies: [{
            movieId: movieData.id,
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
          }]
        });
        console.log('✅ Created favourites and added movie:', movieData.title || movieData.name);
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

      const favourites = await Favourites.findOne({ userId: user._id });
      if (favourites) {
        favourites.movies = favourites.movies.filter(movie => movie.movieId !== movieId);
        favourites.updatedAt = new Date();
        await favourites.save();
        console.log('✅ Removed from favourites:', movieId);
      }
      
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

      const favourites = await Favourites.findOne({ userId: user._id });
      if (!favourites) return [];

      // Convert MongoDB documents to the format expected by the frontend
      return favourites.movies.map(movie => ({
        id: movie.movieId,
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
        addedAt: movie.addedAt
      }));
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
  async addToWatchlist(firebaseId, movieData) {
    try {
      // Get or create user
      const user = await this.createOrUpdateUser(firebaseId, {
        email: 'temp@example.com',
        name: 'User'
      });

      // Check if movie already exists
      const existingWatchlist = await Watchlist.findOne({ userId: user._id });
      
      if (existingWatchlist) {
        // Check if movie already in watchlist
        const movieExists = existingWatchlist.movies.some(movie => movie.movieId === movieData.id);
        
        if (!movieExists) {
          existingWatchlist.movies.push({
            movieId: movieData.id,
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
          });
          existingWatchlist.updatedAt = new Date();
          await existingWatchlist.save();
          console.log('✅ Added to watchlist:', movieData.title || movieData.name);
        } else {
          console.log('⚠️ Movie already in watchlist');
        }
      } else {
        // Create new watchlist document
        await Watchlist.create({
          userId: user._id,
          movies: [{
            movieId: movieData.id,
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
          }]
        });
        console.log('✅ Created watchlist and added movie:', movieData.title || movieData.name);
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

      const watchlist = await Watchlist.findOne({ userId: user._id });
      if (watchlist) {
        watchlist.movies = watchlist.movies.filter(movie => movie.movieId !== movieId);
        watchlist.updatedAt = new Date();
        await watchlist.save();
        console.log('✅ Removed from watchlist:', movieId);
      }
      
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

      const watchlist = await Watchlist.findOne({ userId: user._id });
      if (!watchlist) return [];

      // Convert MongoDB documents to the format expected by the frontend
      return watchlist.movies.map(movie => ({
        id: movie.movieId,
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
        addedAt: movie.addedAt
      }));
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
  async addReview(firebaseId, reviewData) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) throw new Error('User not found');

      const review = await Review.create({
        userId: user._id,
        movieId: reviewData.movieId,
        movieTitle: reviewData.movieTitle,
        moviePoster: reviewData.moviePoster,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText
      });

      console.log('✅ Review added:', review._id);
      return review;
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw error;
    }
  },

  async getReviews(firebaseId) {
    try {
      const user = await this.getUserByFirebaseId(firebaseId);
      if (!user) return [];

      const reviews = await Review.find({ userId: user._id }).sort({ createdAt: -1 });
      
      return reviews.map(review => ({
        id: review._id,
        movieId: review.movieId,
        movieTitle: review.movieTitle,
        moviePoster: review.moviePoster,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt
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

      await Review.findOneAndDelete({ _id: reviewId, userId: user._id });
      console.log('✅ Review deleted:', reviewId);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  }
};




