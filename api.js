// MongoDB API handler for Vercel with actual persistence
import mongoose from 'mongoose';
import { User, Favourites, Watchlist, Review } from './src/database/schemas.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster';

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Connect to MongoDB
    await connectToDatabase();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message 
    });
  }
  
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  
  try {
    // Route handling
    if (pathname === '/api/health') {
      res.status(200).json({
        status: 'OK',
        message: 'Starflix API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        mongodb: isConnected ? 'Connected' : 'Disconnected'
      });
    } else if (pathname === '/api/user' && req.method === 'POST') {
      const { firebaseId, email, name, avatar } = req.body;
      
      // Create or update user
      let user = await User.findOne({ firebaseId });
      if (!user) {
        user = new User({
          firebaseId,
          email,
          name,
          avatar
        });
        await user.save();
      } else {
        // Update existing user
        user.email = email;
        user.name = name;
        user.avatar = avatar;
        await user.save();
      }
      
      res.status(200).json({ success: true, user });
    } else if (pathname.startsWith('/api/favourites/')) {
      const firebaseId = pathname.split('/')[3];
      
      if (req.method === 'GET') {
        // Get user and their favourites
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        let favourites = await Favourites.findOne({ userId: user._id });
        if (!favourites) {
          favourites = new Favourites({ userId: user._id, movies: [] });
          await favourites.save();
        }
        
        res.status(200).json({ success: true, favourites: favourites.movies });
      } else if (req.method === 'POST') {
        // Add to favourites
        const { movieData, userData } = req.body;
        console.log('🎬 Adding to favourites:', movieData.title || movieData.name);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        let favourites = await Favourites.findOne({ userId: user._id });
        if (!favourites) {
          favourites = new Favourites({ userId: user._id, movies: [] });
        }
        
        // Check if movie already exists
        const existingMovie = favourites.movies.find(movie => movie.movieId === movieData.id);
        if (existingMovie) {
          return res.status(400).json({ 
            success: false, 
            message: 'Movie already in favourites!' 
          });
        }
        
        // Add movie to favourites
        favourites.movies.push({
          movieId: movieData.id,
          title: movieData.title,
          name: movieData.name,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          first_air_date: movieData.first_air_date,
          vote_average: movieData.vote_average,
          overview: movieData.overview,
          genre_ids: movieData.genre_ids,
          media_type: movieData.media_type
        });
        
        await favourites.save();
        
        res.status(200).json({ 
          success: true, 
          message: `"${movieData.title || movieData.name}" added to favourites!`,
          movie: movieData
        });
      } else if (req.method === 'DELETE') {
        // Remove from favourites
        const movieId = parseInt(pathname.split('/').pop());
        console.log('🗑️ Removing from favourites:', movieId);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const favourites = await Favourites.findOne({ userId: user._id });
        if (favourites) {
          favourites.movies = favourites.movies.filter(movie => movie.movieId !== movieId);
          await favourites.save();
        }
        
        res.status(200).json({ 
          success: true, 
          message: 'Removed from favourites!',
          movieId: movieId
        });
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    } else if (pathname.startsWith('/api/watchlist/')) {
      const firebaseId = pathname.split('/')[3];
      
      if (req.method === 'GET') {
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        let watchlist = await Watchlist.findOne({ userId: user._id });
        if (!watchlist) {
          watchlist = new Watchlist({ userId: user._id, movies: [] });
          await watchlist.save();
        }
        
        res.status(200).json({ success: true, watchlist: watchlist.movies });
      } else if (req.method === 'POST') {
        const { movieData, userData } = req.body;
        console.log('📺 Adding to watchlist:', movieData.title || movieData.name);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        let watchlist = await Watchlist.findOne({ userId: user._id });
        if (!watchlist) {
          watchlist = new Watchlist({ userId: user._id, movies: [] });
        }
        
        // Check if movie already exists
        const existingMovie = watchlist.movies.find(movie => movie.movieId === movieData.id);
        if (existingMovie) {
          return res.status(400).json({ 
            success: false, 
            message: 'Movie already in watchlist!' 
          });
        }
        
        // Add movie to watchlist
        watchlist.movies.push({
          movieId: movieData.id,
          title: movieData.title,
          name: movieData.name,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          first_air_date: movieData.first_air_date,
          vote_average: movieData.vote_average,
          overview: movieData.overview,
          genre_ids: movieData.genre_ids,
          media_type: movieData.media_type
        });
        
        await watchlist.save();
        
        res.status(200).json({ 
          success: true, 
          message: `"${movieData.title || movieData.name}" added to watchlist!`,
          movie: movieData
        });
      } else if (req.method === 'DELETE') {
        const movieId = parseInt(pathname.split('/').pop());
        console.log('🗑️ Removing from watchlist:', movieId);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const watchlist = await Watchlist.findOne({ userId: user._id });
        if (watchlist) {
          watchlist.movies = watchlist.movies.filter(movie => movie.movieId !== movieId);
          await watchlist.save();
        }
        
        res.status(200).json({ 
          success: true, 
          message: 'Removed from watchlist!',
          movieId: movieId
        });
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    } else if (pathname.startsWith('/api/reviews/')) {
      const firebaseId = pathname.split('/')[3];
      
      if (req.method === 'GET') {
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const reviews = await Review.find({ userId: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
      } else if (req.method === 'POST') {
        const { reviewData, userData } = req.body;
        console.log('📝 Adding review:', reviewData.movieTitle);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const review = new Review({
          userId: user._id,
          movieId: reviewData.movieId,
          movieTitle: reviewData.movieTitle,
          moviePoster: reviewData.moviePoster,
          rating: reviewData.rating,
          reviewText: reviewData.reviewText
        });
        
        await review.save();
        
        res.status(200).json({ 
          success: true, 
          message: 'Review added successfully!',
          review: review
        });
      } else if (req.method === 'PUT') {
        const reviewId = pathname.split('/').pop();
        const { rating, reviewText } = req.body;
        console.log('✏️ Updating review:', reviewId);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const review = await Review.findOneAndUpdate(
          { _id: reviewId, userId: user._id },
          { rating, reviewText, updatedAt: new Date() },
          { new: true }
        );
        
        if (!review) {
          return res.status(404).json({ error: 'Review not found' });
        }
        
        res.status(200).json({ 
          success: true, 
          message: 'Review updated successfully!',
          review: review
        });
      } else if (req.method === 'DELETE') {
        const reviewId = pathname.split('/').pop();
        console.log('🗑️ Deleting review:', reviewId);
        
        const user = await User.findOne({ firebaseId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const review = await Review.findOneAndDelete({ _id: reviewId, userId: user._id });
        if (!review) {
          return res.status(404).json({ error: 'Review not found' });
        }
        
        res.status(200).json({ 
          success: true, 
          message: 'Review deleted successfully!',
          reviewId: reviewId
        });
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    } else {
      res.status(404).json({ error: 'API endpoint not found', pathname });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
