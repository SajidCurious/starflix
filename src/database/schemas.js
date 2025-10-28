// MongoDB schemas for Starflix
import mongoose from 'mongoose';

// User schema
const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Movie schema for favourites and watchlist
const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true
  },
  title: String,
  name: String, // for TV shows
  poster_path: String,
  backdrop_path: String,
  release_date: String,
  first_air_date: String,
  vote_average: Number,
  overview: String,
  genre_ids: [Number],
  media_type: {
    type: String,
    default: 'movie'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Favourites schema
const favouritesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movies: [movieSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Watchlist schema
const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movies: [movieSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Review schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  movieTitle: String,
  moviePoster: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewText: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
export const User = mongoose.model('User', userSchema);
export const Favourites = mongoose.model('Favourites', favouritesSchema);
export const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export const Review = mongoose.model('Review', reviewSchema);






