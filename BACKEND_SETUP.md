# 🚀 Starflix Backend Setup Instructions

## Quick Setup for MongoDB Atlas Integration

### 1. Install Backend Dependencies

```bash
# Install backend dependencies
npm install express mongoose cors nodemon

# Or copy the backend-package.json to package.json and run:
npm install
```

### 2. Start the Backend Server

```bash
# Start the backend server
node server.js

# Or for development with auto-restart:
npx nodemon server.js
```

### 3. Verify Backend is Running

The backend server will start on `http://localhost:5000`

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Starflix API server running on port 5000
📡 API endpoints available at http://localhost:5000/api
```

### 4. Test API Health

Visit `http://localhost:5000/api/health` in your browser to verify the API is working.

### 5. Start Your Frontend

In a separate terminal, start your React app:
```bash
npm run dev
```

## API Endpoints

Your backend provides these endpoints:

- `GET /api/health` - Health check
- `POST /api/user` - Create/update user
- `GET /api/favourites/:userId` - Get user's favourites
- `POST /api/favourites/:userId` - Add to favourites
- `DELETE /api/favourites/:userId/:movieId` - Remove from favourites
- `GET /api/watchlist/:userId` - Get user's watchlist
- `POST /api/watchlist/:userId` - Add to watchlist
- `DELETE /api/watchlist/:userId/:movieId` - Remove from watchlist
- `GET /api/reviews/:userId` - Get user's reviews
- `POST /api/reviews/:userId` - Add review
- `DELETE /api/reviews/:userId/:reviewId` - Delete review

## MongoDB Atlas Connection

The backend automatically connects to your MongoDB Atlas cluster using the connection string in `server.js`:
```
mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix
```

## What Happens Now

1. **Frontend** sends API requests to `http://localhost:5000/api`
2. **Backend** processes requests and connects to MongoDB Atlas
3. **MongoDB Atlas** stores all user data (favourites, watchlist, reviews)
4. **Data persists** across devices and sessions

Your Starflix app now uses MongoDB Atlas for data storage! 🍃✨




