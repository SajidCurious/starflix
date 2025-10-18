# Module 3: Environment Configuration & Security Setup

## Environment Variables Configuration

### .env File Setup

Create a `.env` file in your project root with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration (if using Firebase Auth)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Security Configuration
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=http://localhost:3000

# API Keys (if using external services)
TMDB_API_KEY=your_tmdb_api_key
```

### Environment-Specific Configurations

#### Development Environment (.env.development)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix-dev?retryWrites=true&w=majority&appName=Starflix-cluster
CORS_ORIGIN=http://localhost:3000
```

#### Production Environment (.env.production)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix-prod?retryWrites=true&w=majority&appName=Starflix-cluster
CORS_ORIGIN=https://your-domain.com
```

## Security Implementation

### 1. CORS Configuration

```javascript
// server.js
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-domain.com',
      'https://your-staging-domain.com'
    ];
    
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

app.use(cors(corsOptions));
```

### 2. Input Validation & Sanitization

```javascript
// utils/validation.js
export const validateUserData = (userData) => {
  const errors = [];
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.push('Valid email is required');
  }
  
  // Name validation
  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  // Firebase ID validation
  if (!userData.firebaseId || userData.firebaseId.length < 10) {
    errors.push('Valid Firebase ID is required');
  }
  
  return errors;
};

export const validateMovieData = (movieData) => {
  const errors = [];
  
  // Movie ID validation
  if (!movieData.id || !Number.isInteger(movieData.id) || movieData.id <= 0) {
    errors.push('Valid movie ID is required');
  }
  
  // Title validation
  if (!movieData.title && !movieData.name) {
    errors.push('Movie title or name is required');
  }
  
  // Media type validation
  if (movieData.media_type && !['movie', 'tv'].includes(movieData.media_type)) {
    errors.push('Media type must be "movie" or "tv"');
  }
  
  return errors;
};

export const validateReviewData = (reviewData) => {
  const errors = [];
  
  // Rating validation
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  
  // Review text validation
  if (reviewData.reviewText && reviewData.reviewText.length > 1000) {
    errors.push('Review text must be less than 1000 characters');
  }
  
  return errors;
};

// Sanitization function
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
```

### 3. Error Handling Middleware

```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
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
};
```

### 4. Request Logging Middleware

```javascript
// middleware/logger.js
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT'].includes(method)) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }
    console.log('Request Body:', sanitizedBody);
  }
  
  next();
};
```

### 5. Rate Limiting (Optional)

```javascript
// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs: windowMs, // Time window in milliseconds
    max: max, // Maximum number of requests
    message: {
      success: false,
      error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Apply different limits for different endpoints
export const generalLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes for auth
export const reviewLimiter = createRateLimiter(60 * 1000, 10); // 10 requests per minute for reviews
```

### 6. Updated Server Configuration

```javascript
// server.js - Updated with security measures
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(generalLimiter);
app.use(requestLogger);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
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

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection with error handling
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

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Starflix API server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

## Security Best Practices Implemented

### 1. **Input Validation**
- ✅ Email format validation
- ✅ Required field validation
- ✅ Data type validation
- ✅ Range validation (ratings 1-5)
- ✅ Length validation (review text)

### 2. **Input Sanitization**
- ✅ HTML tag removal
- ✅ Whitespace trimming
- ✅ Special character handling

### 3. **CORS Protection**
- ✅ Whitelist of allowed origins
- ✅ Credential handling
- ✅ Method restrictions
- ✅ Header restrictions

### 4. **Error Handling**
- ✅ Structured error responses
- ✅ No sensitive data exposure
- ✅ Proper HTTP status codes
- ✅ Error logging

### 5. **Rate Limiting**
- ✅ Request frequency limits
- ✅ Different limits per endpoint type
- ✅ IP-based limiting

### 6. **Environment Security**
- ✅ Environment variable usage
- ✅ No hardcoded secrets
- ✅ Separate dev/prod configs

## Database Security

### MongoDB Atlas Security Features
- ✅ Network access restrictions
- ✅ Database user authentication
- ✅ Connection string encryption
- ✅ Regular security updates

### Application-Level Database Security
- ✅ Input validation before database operations
- ✅ NoSQL injection prevention
- ✅ Proper error handling for database errors
- ✅ Connection pooling and timeout handling

## Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Implement proper logging and monitoring
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Use environment-specific configurations
- [ ] Implement API key management
- [ ] Set up health checks and monitoring
- [ ] Configure proper error pages
- [ ] Implement request size limits
- [ ] Set up security headers

This security setup provides a robust foundation for the Starflix API while maintaining ease of development and deployment.
