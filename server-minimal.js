// Minimal server for Vercel deployment testing
import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration for Vercel
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://starflix9.vercel.app',
      'https://starflix-frontend.vercel.app',
      'https://starflix-j50x0y783-sajidcurious-projects.vercel.app', // Your current Vercel preview URL
      'https://starflix.vercel.app', // Your main Vercel URL
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
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'Starflix API is running!',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      database: 'Not connected (minimal server)',
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

// Basic endpoints for testing
app.get('/api/favourites/:userId', (req, res) => {
  res.json({ success: true, favourites: [] });
});

app.get('/api/watchlist/:userId', (req, res) => {
  res.json({ success: true, watchlist: [] });
});

app.get('/api/reviews/:userId', (req, res) => {
  res.json({ success: true, reviews: [] });
});

// User creation endpoint (without MongoDB)
app.post('/api/user', async (req, res) => {
  try {
    const { firebaseId, email, name, avatar } = req.body;
    
    // Mock user response without database
    const user = {
      _id: 'mock_' + Date.now(),
      firebaseId,
      email: email || 'temp@example.com',
      name: name || 'User',
      avatar: avatar || 'https://ui-avatars.com/api/?name=User&background=random',
      createdAt: new Date()
    };
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
