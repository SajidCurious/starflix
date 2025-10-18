// Backend server for Starflix MongoDB Atlas integration
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Starflix API is running!' });
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

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Starflix API server running on port ${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
export default app;
