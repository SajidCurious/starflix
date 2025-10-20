# Module 3: API Deployment Guide

## Deployment Overview

This guide covers deploying the Starflix API to various cloud platforms. The API is built with Node.js, Express, and MongoDB Atlas.

## Deployment Options

### 1. Vercel (Currently Deployed)

**Why Vercel?**
- Free tier available
- Automatic deployments from GitHub
- Built-in environment variable management
- Easy MongoDB Atlas integration
- Automatic HTTPS
- Serverless functions support
- Global CDN

#### Step-by-Step Deployment to Vercel

1. **Prepare Your Repository**
   ```bash
   # Ensure your code is pushed to GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

3. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your API

4. **Configure Project Settings**
   ```
   Framework Preset: Other
   Build Command: npm install
   Output Directory: ./
   Install Command: npm install
   ```

5. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
   NODE_ENV=production
   PORT=5000
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your API will be available at: `https://starflix-api.vercel.app`

### 2. Heroku Deployment

#### Prerequisites
```bash
# Install Heroku CLI
npm install -g heroku
```

#### Deployment Steps

1. **Create Heroku App**
   ```bash
   heroku login
   heroku create starflix-api
   ```

2. **Configure Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster"
   heroku config:set NODE_ENV="production"
   heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **Open App**
   ```bash
   heroku open
   ```

### 3. Render Deployment

#### Prerequisites
```bash
# No additional CLI tools required
```

#### Deployment Steps

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Settings**
   ```
   Name: starflix-api
   Environment: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
   NODE_ENV=production
   PORT=10000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### 4. Railway Deployment

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Settings**
   ```
   Build Command: npm install
   Start Command: node server.js
   ```

3. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
   NODE_ENV=production
   PORT=10000
   ```

## Production Configuration

### Updated server.js for Production

```javascript
// server.js - Production ready
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
      process.env.CORS_ORIGIN,
      'https://your-frontend-domain.com'
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

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// MongoDB Schemas (same as before)
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

// API Routes (same as before)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Starflix API is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ... (all other routes remain the same)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Starflix API server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### Production package.json

```json
{
  "name": "starflix-api",
  "version": "1.0.0",
  "description": "Starflix API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required for Node.js'",
    "test": "echo 'No tests specified'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": "22.x",
    "npm": ">=8.0.0"
  },
  "keywords": ["starflix", "api", "mongodb", "movies"],
  "author": "Starflix Team",
  "license": "MIT"
}
```

## Environment Variables for Production

### Required Environment Variables
```bash
# Database
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster

# Server
NODE_ENV=production
PORT=5000

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Optional: Firebase (if using Firebase Auth)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

## Deployment Verification

### Health Check Endpoint
```bash
curl https://your-api-domain.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Starflix API is running!",
  "environment": "production",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test API Endpoints
```bash
# Test user creation
curl -X POST https://your-api-domain.com/api/user \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseId": "test_user_123",
    "email": "test@example.com",
    "name": "Test User"
  }'

# Test favourites
curl https://your-api-domain.com/api/favourites/test_user_123
```

## Monitoring and Maintenance

### 1. Health Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Set up alerts for downtime

### 2. Logging
- Implement structured logging
- Monitor error rates
- Track API usage patterns

### 3. Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for connection issues
- Regular backup verification

### 4. Performance Optimization
- Implement caching for frequently accessed data
- Optimize database queries
- Monitor memory usage

## Troubleshooting Common Issues

### 1. CORS Errors
```javascript
// Ensure CORS_ORIGIN is set correctly
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Database Connection Issues
```javascript
// Check MongoDB URI format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 3. Port Issues
```javascript
// Use PORT environment variable
const PORT = process.env.PORT || 5000;
```

### 4. Memory Issues
```javascript
// Increase memory limit if needed
node --max-old-space-size=4096 server.js
```

## Deployment URLs

### Current Production Deployment
- **Vercel:** `https://starflix-api.vercel.app`
- **Health Check:** `https://starflix-api.vercel.app/api/health`
- **Status:** ✅ Active and Running

### Alternative Deployment Options
- **Render:** `https://starflix-api.onrender.com` (if deployed)
- **Heroku:** `https://starflix-api.herokuapp.com` (if deployed)
- **Railway:** `https://starflix-api.railway.app` (if deployed)

## Security Considerations for Production

1. **HTTPS Only**: All production deployments use HTTPS
2. **Environment Variables**: Never commit secrets to code
3. **CORS Configuration**: Restrict origins to known domains
4. **Rate Limiting**: Implement rate limiting for production
5. **Error Handling**: Don't expose sensitive information in errors
6. **Database Security**: Use MongoDB Atlas security features
7. **Monitoring**: Set up proper logging and monitoring

This deployment guide ensures your Starflix API is production-ready and secure.
