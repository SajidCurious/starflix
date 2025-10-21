// Simplified server for Vercel deployment
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster';

console.log('🔍 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Simple schemas
const userSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'Starflix API is running!',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
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

// User creation endpoint
app.post('/api/user', async (req, res) => {
  try {
    const { firebaseId, email, name, avatar } = req.body;
    
    let user = await User.findOne({ firebaseId });
    if (!user) {
      user = new User({
        firebaseId,
        email: email || 'temp@example.com',
        name: name || 'User',
        avatar: avatar
      });
      await user.save();
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Basic endpoints for testing
app.get('/api/favourites/:userId', async (req, res) => {
  res.json({ success: true, favourites: [] });
});

app.get('/api/watchlist/:userId', async (req, res) => {
  res.json({ success: true, watchlist: [] });
});

app.get('/api/reviews/:userId', async (req, res) => {
  res.json({ success: true, reviews: [] });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
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

// Export for Vercel
export default app;
