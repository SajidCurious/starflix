# Module 3: API Endpoints Documentation

## API Overview

**Base URL:** `http://localhost:5000/api` (Development)  
**Production URL:** `https://starflix9.vercel.app/api` (Vercel Deployment)

**Authentication:** Firebase Authentication (JWT tokens)  
**Content-Type:** `application/json`  
**Database:** MongoDB Atlas (NoSQL)  
**Framework:** Node.js + Express.js

## API Endpoints

### 1. Health Check

#### GET /api/health
Check if the API is running.

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Starflix API is running!",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Success

---

### 2. User Management

#### POST /api/user
Create or retrieve a user account.

**Request:**
```http
POST /api/user
Content-Type: application/json

{
  "firebaseId": "firebase_user_123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firebaseId": "firebase_user_123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

---

### 3. Favourites Management

#### GET /api/favourites/:userId
Get user's favorite movies/TV shows.

**Request:**
```http
GET /api/favourites/firebase_user_123456789
```

**Response:**
```json
{
  "success": true,
  "favourites": [
    {
      "id": 550,
      "title": "Fight Club",
      "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "backdrop_path": "/87hTDiay2N2qWyX4D7C5b7hUjF5.jpg",
      "release_date": "1999-10-15",
      "vote_average": 8.433,
      "overview": "A ticking-time-bomb insomniac...",
      "genre_ids": [18],
      "media_type": "movie",
      "addedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

#### POST /api/favourites/:userId
Add a movie/TV show to favorites.

**Request:**
```http
POST /api/favourites/firebase_user_123456789
Content-Type: application/json

{
  "userData": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "movieData": {
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "backdrop_path": "/87hTDiay2N2qWyX4D7C5b7hUjF5.jpg",
    "release_date": "1999-10-15",
    "vote_average": 8.433,
    "overview": "A ticking-time-bomb insomniac...",
    "genre_ids": [18],
    "media_type": "movie"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to favourites"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

#### DELETE /api/favourites/:userId/:movieId
Remove a movie/TV show from favorites.

**Request:**
```http
DELETE /api/favourites/firebase_user_123456789/550
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from favourites"
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found
- `500` - Server Error

---

### 4. Watchlist Management

#### GET /api/watchlist/:userId
Get user's watchlist.

**Request:**
```http
GET /api/watchlist/firebase_user_123456789
```

**Response:**
```json
{
  "success": true,
  "watchlist": [
    {
      "id": 238,
      "title": "The Godfather",
      "poster_path": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "release_date": "1972-03-14",
      "vote_average": 8.7,
      "overview": "Spanning the years 1945 to 1955...",
      "genre_ids": [18, 80],
      "media_type": "movie",
      "addedAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

#### POST /api/watchlist/:userId
Add a movie/TV show to watchlist.

**Request:**
```http
POST /api/watchlist/firebase_user_123456789
Content-Type: application/json

{
  "userData": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "movieData": {
    "id": 238,
    "title": "The Godfather",
    "poster_path": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "backdrop_path": "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    "release_date": "1972-03-14",
    "vote_average": 8.7,
    "overview": "Spanning the years 1945 to 1955...",
    "genre_ids": [18, 80],
    "media_type": "movie"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to watchlist"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

#### DELETE /api/watchlist/:userId/:movieId
Remove a movie/TV show from watchlist.

**Request:**
```http
DELETE /api/watchlist/firebase_user_123456789/238
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from watchlist"
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found
- `500` - Server Error

---

### 5. Reviews Management

#### GET /api/reviews/:userId
Get user's reviews.

**Request:**
```http
GET /api/reviews/firebase_user_123456789
```

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "507f1f77bcf86cd799439013",
      "movieId": 550,
      "movieTitle": "Fight Club",
      "moviePoster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "rating": 5,
      "reviewText": "An absolute masterpiece! The plot twists are incredible.",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

#### POST /api/reviews/:userId
Create a new review.

**Request:**
```http
POST /api/reviews/firebase_user_123456789
Content-Type: application/json

{
  "userData": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "reviewData": {
    "movieId": 550,
    "movieTitle": "Fight Club",
    "moviePoster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "rating": 5,
    "reviewText": "An absolute masterpiece! The plot twists are incredible."
  }
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "movieId": 550,
    "movieTitle": "Fight Club",
    "moviePoster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "rating": 5,
    "reviewText": "An absolute masterpiece! The plot twists are incredible.",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

#### PUT /api/reviews/:userId/:reviewId
Update an existing review.

**Request:**
```http
PUT /api/reviews/firebase_user_123456789/507f1f77bcf86cd799439013
Content-Type: application/json

{
  "rating": 4,
  "reviewText": "Updated review text here."
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "movieId": 550,
    "movieTitle": "Fight Club",
    "moviePoster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "rating": 4,
    "reviewText": "Updated review text here.",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - User or review not found
- `500` - Server Error

#### DELETE /api/reviews/:userId/:reviewId
Delete a review.

**Request:**
```http
DELETE /api/reviews/firebase_user_123456789/507f1f77bcf86cd799439013
```

**Response:**
```json
{
  "success": true,
  "message": "Review deleted"
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found
- `500` - Server Error

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side error)

## Request Validation

### Input Sanitization
All endpoints include:
- **Data type validation** (numbers, strings, arrays)
- **Required field validation**
- **Range validation** (ratings 1-5)
- **Length validation** (review text max 1000 characters)
- **Format validation** (email format, date format)

### Security Measures
- **CORS enabled** for cross-origin requests
- **Input sanitization** to prevent injection attacks
- **Firebase authentication** for user verification
- **MongoDB ObjectId validation** for database queries

## Rate Limiting
Currently no rate limiting implemented, but recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## API Versioning
Current version: v1 (implicit)  
Future versions will use URL path: `/api/v2/`

## Environment Variables
The API uses the following environment variables:
```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD_Kjye43E69b-KMsM9jYcRNIvVzvbYv-o
VITE_FIREBASE_AUTH_DOMAIN=starflix-auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=starflix-auth

# TMDB API Configuration
VITE_TMDB_API_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzczZTAyYTZlZDdmMDM0NzEzNzI5MDA3MWEwYzEyOSIsIm5iZiI6MTc1NzQ3MzQzMC4wMzMsInN1YiI6IjY4YzBlYTk2MDQ1OWUzN2YxNzFiZDg2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jTYzse9lXmqdCGDDu6aTHm5l1YMTb4QWx8WGDcFt7R0

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Testing
All endpoints have been tested with:
- Valid data scenarios
- Invalid data scenarios
- Edge cases
- Error conditions

See `MODULE_3_POSTMAN_TESTING.md` for detailed test results and screenshots.

## Deployment URLs
- **Vercel:** `https://starflix9.vercel.app/api`
- **Health Check:** `https://starflix9.vercel.app/api/health`

