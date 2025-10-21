// Backend server for Starflix MongoDB Atlas integration
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Production CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://starflix9.vercel.app',
      'https://starflix-frontend.vercel.app',
      'https://your-frontend-domain.com', // Replace with your actual frontend domain
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Atlas connection with enhanced error handling
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const movieSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  title: String,
  name: String,
  poster_path: String,
  backdrop_path: String,
  release_date: String,
  first_air_date: String,
  vote_average: Number,
  overview: String,
  genre_ids: [Number],
  media_type: { type: String, default: 'movie' },
  addedAt: { type: Date, default: Date.now }
});

const favouritesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [movieSchema],
  updatedAt: { type: Date, default: Date.now }
});

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [movieSchema],
  updatedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: Number, required: true },
  movieTitle: String,
  moviePoster: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Favourites = mongoose.model('Favourites', favouritesSchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);
const Review = mongoose.model('Review', reviewSchema);

// Helper function to get or create user
async function getOrCreateUser(firebaseId, userData) {
  let user = await User.findOne({ firebaseId });
  if (!user) {
    user = new User({
      firebaseId,
      email: userData.email || 'temp@example.com',
      name: userData.name || 'User',
      avatar: userData.avatar
    });
    await user.save();
  }
  return user;
}

// API Routes

// Health check endpoint with enhanced information
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'Starflix API is running!',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// User routes
app.post('/api/user', async (req, res) => {
  try {
    const { firebaseId, email, name, avatar } = req.body;
    const user = await getOrCreateUser(firebaseId, { email, name, avatar });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Favourites routes
app.get('/api/favourites/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.json({ success: true, favourites: [] });

    const favourites = await Favourites.findOne({ userId: user._id });
    const movies = favourites ? favourites.movies.map(movie => ({
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
    })) : [];

    res.json({ success: true, favourites: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/favourites/:userId', async (req, res) => {
  try {
    const user = await getOrCreateUser(req.params.userId, req.body.userData || {});
    const movieData = req.body.movieData;

    let favourites = await Favourites.findOne({ userId: user._id });
    
    if (!favourites) {
      favourites = new Favourites({
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
    } else {
      const movieExists = favourites.movies.some(movie => movie.movieId === movieData.id);
      if (!movieExists) {
        favourites.movies.push({
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
        favourites.updatedAt = new Date();
      }
    }

    await favourites.save();
    res.json({ success: true, message: 'Added to favourites' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/favourites/:userId/:movieId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const favourites = await Favourites.findOne({ userId: user._id });
    if (favourites) {
      favourites.movies = favourites.movies.filter(movie => movie.movieId !== parseInt(req.params.movieId));
      favourites.updatedAt = new Date();
      await favourites.save();
    }

    res.json({ success: true, message: 'Removed from favourites' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Watchlist routes
app.get('/api/watchlist/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.json({ success: true, watchlist: [] });

    const watchlist = await Watchlist.findOne({ userId: user._id });
    const movies = watchlist ? watchlist.movies.map(movie => ({
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
    })) : [];

    res.json({ success: true, watchlist: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/watchlist/:userId', async (req, res) => {
  try {
    const user = await getOrCreateUser(req.params.userId, req.body.userData || {});
    const movieData = req.body.movieData;

    let watchlist = await Watchlist.findOne({ userId: user._id });
    
    if (!watchlist) {
      watchlist = new Watchlist({
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
    } else {
      const movieExists = watchlist.movies.some(movie => movie.movieId === movieData.id);
      if (!movieExists) {
        watchlist.movies.push({
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
        watchlist.updatedAt = new Date();
      }
    }

    await watchlist.save();
    res.json({ success: true, message: 'Added to watchlist' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/watchlist/:userId/:movieId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const watchlist = await Watchlist.findOne({ userId: user._id });
    if (watchlist) {
      watchlist.movies = watchlist.movies.filter(movie => movie.movieId !== parseInt(req.params.movieId));
      watchlist.updatedAt = new Date();
      await watchlist.save();
    }

    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reviews routes
app.get('/api/reviews/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.json({ success: true, reviews: [] });

    const reviews = await Review.find({ userId: user._id }).sort({ createdAt: -1 });
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      movieId: review.movieId,
      movieTitle: review.movieTitle,
      moviePoster: review.moviePoster,
      rating: review.rating,
      reviewText: review.reviewText,
      createdAt: review.createdAt
    }));

    res.json({ success: true, reviews: formattedReviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/reviews/:userId', async (req, res) => {
  try {
    const user = await getOrCreateUser(req.params.userId, req.body.userData || {});
    const reviewData = req.body.reviewData;

    const review = new Review({
      userId: user._id,
      movieId: reviewData.movieId,
      movieTitle: reviewData.movieTitle,
      moviePoster: reviewData.moviePoster,
      rating: reviewData.rating,
      reviewText: reviewData.reviewText
    });

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/reviews/:userId/:reviewId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const { rating, reviewText } = req.body;
    
    const updatedReview = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, userId: user._id },
      { 
        rating: rating,
        reviewText: reviewText,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.json({ success: true, review: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/reviews/:userId/:reviewId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    await Review.findOneAndDelete({ _id: req.params.reviewId, userId: user._id });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation'
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Starflix API server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
});

// Export for Vercel
export default app;
