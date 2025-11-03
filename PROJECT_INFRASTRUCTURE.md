# Starflix Project Infrastructure

## Overview
Starflix is a full-stack movie streaming web application similar to Netflix, built with React frontend and Express.js backend, using MongoDB Atlas for data persistence and Firebase for authentication.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (BROWSER)                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      REACT FRONTEND (Vite)                           │  │
│  │                                                                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐    │  │
│  │  │                    PAGES & COMPONENTS                       │    │  │
│  │  │  • Home (Hero, Trending, Popular, Top Rated)               │    │  │
│  │  │  • Details (Movie/TV Show details, cast, videos, reviews)  │    │  │
│  │  │  • Personal (Favourites, Watchlist, Reviews)               │    │  │
│  │  │  • Search & Explore                                        │    │  │
│  │  │  • Header, Footer, Login Modal, User Dropdown              │    │  │
│  │  └────────────────────────────────────────────────────────────┘    │  │
│  │                                                                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐    │  │
│  │  │                       REDUX STORE                           │    │  │
│  │  │  • authSlice (user auth state)                              │    │  │
│  │  │  • homeSlice (API config, genres)                          │    │  │
│  │  └────────────────────────────────────────────────────────────┘    │  │
│  │                                                                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐    │  │
│  │  │                      UTILITIES                              │    │  │
│  │  │  • api.js (TMDB API client)                                 │    │  │
│  │  │  • apiDataService.js (Backend API client)                 │    │  │
│  │  │  • authService.js (Firebase auth)                          │    │  │
│  │  └────────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐         ┌──────────────────────┐     ┌──────────────────┐
│              │         │                      │     │                  │
│    TMDB      │         │   BACKEND API        │     │    FIREBASE      │
│   (Movie     │         │   (Express.js)       │     │  (Authentication)│
│  Database)   │         │                      │     │                  │
│              │         │  Deployed on Vercel │     │  • Google Auth    │
│  API Token   │         │                      │     │  • User Profiles  │
│  Required    │         │  ┌────────────────┐ │     │  • Firebase ID    │
└──────────────┘         │  │   API Routes   │ │     └──────────────────┘
                         │  │                │ │               │
│ Fetch Movie Data       │  │ GET/POST/DELETE│ │               │
│ (trending, popular,    │  │  /api/user     │ │               │
│  details, search)      │  │  /api/favourites│ │               │
│                        │  │  /api/watchlist │ │               │
│                        │  │  /api/reviews   │ │               │
│                        │  │  /api/health    │ │               │
│                        │  └────────────────┘ │               │
│                        │                      │               │
│                        │  ┌────────────────┐ │               │
│                        │  │   MIDDLEWARE   │ │               │
│                        │  │  • CORS        │ │               │
│                        │  │  • Body Parser │ │               │
│                        │  │  • Auth Check  │ │               │
│                        │  └────────────────┘ │               │
│                        └──────────────────────┘               │
                                   │                            │
                                   │                            │
                                   ▼                            ▼
                         ┌────────────────────┐     ┌──────────────────┐
                         │   MONGODB ATLAS     │     │   FIREBASE AUTH  │
                         │   (Cloud Database)  │     │   (User Session) │
                         │                     │     │                  │
                         │  ┌────────────────┐│     │  • Login State   │
                         │  │    SCHEMAS     ││     │  • User Token    │
                         │  │                ││     │  • Auth Header   │
                         │  │ • User         ││     └──────────────────┘
                         │  │ • Favourites   ││
                         │  │ • Watchlist    ││
                         │  │ • Reviews      ││
                         │  │ • Movie Data   ││
                         │  └────────────────┘│
                         │                     │
                         └────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18.2.0 with Vite 4.4.5
- **State Management**: Redux Toolkit (React Redux 8.0.5)
- **Routing**: React Router DOM 6.6.2
- **HTTP Client**: Axios 1.2.2
- **UI Libraries**:
  - React Icons 4.7.1
  - React Player 2.11.0 (video playback)
  - React Lazy Load Image Component 1.5.6
  - React Infinite Scroll Component 6.1.0
  - React Select 5.7.0
- **Styling**: SASS 1.57.1, Tailwind CSS 3.3.3
- **Build Tool**: Vite (fast development & optimized production builds)

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express 5.1.0
- **Database**: MongoDB Atlas (cloud-hosted)
- **ORM/ODM**: Mongoose 8.19.1
- **Middleware**: 
  - CORS 2.8.5
  - dotenv 16.3.1
- **Deployment**: Vercel (serverless functions)

### External Services
- **Authentication**: Firebase Authentication (Google OAuth)
- **Movie Data**: The Movie Database (TMDB) API
- **Database**: MongoDB Atlas (cloud)
- **Hosting**: Vercel (frontend + backend)

---

## Data Flow

### 1. Movie Discovery Flow
```
User → React Frontend → TMDB API → Movie Data → Display in UI
```

### 2. User Authentication Flow
```
User → React Frontend → Firebase Auth → Google OAuth → User Token → Redux Store
```

### 3. Personal Data Management Flow
```
User Action → React Frontend → Backend API → MongoDB Atlas → Data Storage
                                      ↓
                               Response to Frontend
                                      ↓
                               Update Redux Store
                                      ↓
                                  UI Update
```

### Example: Adding to Favourites
```
1. User clicks "Add to Favourites" button
   ↓
2. React component calls apiDataService.addFavourite(userId, movieData)
   ↓
3. HTTP POST request to /api/favourites/:userId
   ↓
4. Backend (Express) receives request
   ↓
5. Backend queries MongoDB for user by firebaseId
   ↓
6. Backend creates/updates Favourites document
   ↓
7. Backend saves to MongoDB Atlas
   ↓
8. Backend returns success response
   ↓
9. Frontend updates Redux store
   ↓
10. UI shows confirmation toast
```

---

## API Endpoints

### Backend API (Express)
All endpoints are prefixed with `/api`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check & status | No |
| POST | `/api/user` | Create/update user | Yes |
| GET | `/api/favourites/:userId` | Get user's favourites | Yes |
| POST | `/api/favourites/:userId` | Add to favourites | Yes |
| DELETE | `/api/favourites/:userId/:movieId` | Remove from favourites | Yes |
| GET | `/api/watchlist/:userId` | Get user's watchlist | Yes |
| POST | `/api/watchlist/:userId` | Add to watchlist | Yes |
| DELETE | `/api/watchlist/:userId/:movieId` | Remove from watchlist | Yes |
| GET | `/api/reviews/:userId` | Get user's reviews | Yes |
| POST | `/api/reviews/:userId` | Add review | Yes |
| PUT | `/api/reviews/:userId/:reviewId` | Update review | Yes |
| DELETE | `/api/reviews/:userId/:reviewId` | Delete review | Yes |

### External API (TMDB)
Used for fetching movie data

| Endpoint | Description |
|----------|-------------|
| `/configuration` | Get image base URLs |
| `/genre/movie/list` | Get movie genres |
| `/genre/tv/list` | Get TV show genres |
| `/trending/{mediaType}/{timeWindow}` | Get trending content |
| `/movie/popular` | Get popular movies |
| `/tv/popular` | Get popular TV shows |
| `/movie/{id}` | Get movie details |
| `/tv/{id}` | Get TV show details |
| `/search/multi` | Search movies/TV shows |

---

## Database Schema (MongoDB)

### Collections

#### 1. `users` Collection
```javascript
{
  firebaseId: String (unique, required),
  email: String (required),
  name: String (required),
  avatar: String,
  createdAt: Date
}
```

#### 2. `favourites` Collection
```javascript
{
  userId: ObjectId (ref: User, required),
  movies: [{
    movieId: Number,
    title: String,
    name: String,
    poster_path: String,
    backdrop_path: String,
    release_date: String,
    first_air_date: String,
    vote_average: Number,
    overview: String,
    genre_ids: [Number],
    media_type: String,
    addedAt: Date
  }],
  updatedAt: Date
}
```

#### 3. `watchlist` Collection
```javascript
{
  userId: ObjectId (ref: User, required),
  movies: [movieSchema] // Same as favourites
}
```

#### 4. `reviews` Collection
```javascript
{
  userId: ObjectId (ref: User, required),
  movieId: Number,
  movieTitle: String,
  moviePoster: String,
  rating: Number (1-5, required),
  reviewText: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Deployment Architecture

### Vercel Deployment
- **Frontend**: Static build deployed to Vercel CDN
- **Backend**: Serverless functions on Vercel
- **Build Process**: 
  1. `vite build` - Builds React app → `dist/` folder
  2. Static files served from CDN
  3. API routes handled by serverless functions

### Environment Variables
```
# Frontend (.env)
VITE_TMDB_API_TOKEN=***
VITE_FIREBASE_API_KEY=***
VITE_FIREBASE_AUTH_DOMAIN=***
VITE_FIREBASE_PROJECT_ID=***
VITE_FIREBASE_STORAGE_BUCKET=***
VITE_FIREBASE_MESSAGING_SENDER_ID=***
VITE_FIREBASE_APP_ID=***
VITE_FIREBASE_MEASUREMENT_ID=***

# Backend
MONGODB_URI=***
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
PORT=5000
```

---

## Security Features

1. **CORS Configuration**: Restricted to specific origins
2. **Firebase Authentication**: Secure user authentication with Google OAuth
3. **Environment Variables**: Sensitive data stored in environment variables
4. **User Isolation**: Data scoped by firebaseId for security
5. **HTTPS**: All communications encrypted

---

## File Structure

```
starflix/
├── src/                          # Frontend source code
│   ├── components/              # Reusable React components
│   │   ├── header/
│   │   ├── footer/
│   │   ├── carousel/
│   │   ├── movieCard/
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── home/
│   │   ├── details/
│   │   ├── personal/
│   │   └── ...
│   ├── store/                   # Redux store
│   │   ├── authSlice.js
│   │   ├── homeSlice.js
│   │   └── store.js
│   ├── utils/                   # Utility functions
│   │   ├── api.js              # TMDB API client
│   │   ├── apiDataService.js   # Backend API client
│   │   └── authService.js      # Firebase auth
│   ├── database/               # Database configs
│   │   ├── schemas.js
│   │   └── mongodb.js
│   └── firebase/
│       └── config.js
├── api/                         # Vercel serverless functions
│   ├── favourites/
│   ├── watchlist/
│   ├── reviews/
│   └── ...
├── server.js                    # Main Express server
├── api.js                       # Vercel API handler
├── dist/                        # Production build output
├── package.json                 # Dependencies
├── vercel.json                  # Vercel deployment config
└── vite.config.js              # Vite configuration
```

---

## How It Works

### Development Flow
1. Run `npm run dev` to start development server
2. Vite serves React app with hot module replacement
3. Backend runs on Express (port 5000)
4. Frontend runs on Vite dev server (port 5173)

### Production Flow
1. Build: `vite build` creates optimized bundle in `dist/`
2. Deploy: Vercel detects changes and deploys
3. Static files served from CDN
4. API routes handled by serverless functions
5. MongoDB Atlas connection maintained through Vercel runtime

### Request Lifecycle
```
1. User visits app → Vercel CDN serves HTML
2. Browser loads React app → Makes API calls
3. TMDB API calls → Fetches movie data
4. Backend API calls → Fetches user data from MongoDB
5. All data rendered in React components
6. User interacts → Updates Redux store → Saves to MongoDB
```

---

## Key Features

### User Features
- 🔐 Google OAuth authentication
- 🎬 Browse trending, popular, top-rated movies/TV shows
- ❤️ Add/remove favourites
- 📺 Manage watchlist
- ⭐ Rate and review movies
- 🔍 Search functionality
- 📱 Responsive design
- 🎥 Watch trailers
- 👥 View cast and crew
- 🎭 Explore by genres

### Technical Features
- 🚀 Fast development with Vite
- 📦 Optimized production builds
- 🔄 Real-time state management with Redux
- 🎨 Modern UI with React components
- 💾 Persistent data with MongoDB Atlas
- ☁️ Serverless backend on Vercel
- 🔒 Secure authentication with Firebase
- 📊 RESTful API architecture

---

## Performance Optimizations

1. **Code Splitting**: React lazy loading
2. **Image Optimization**: Lazy loading with react-lazy-load-image-component
3. **CDN**: Static assets served from Vercel CDN
4. **Caching**: API responses cached in Redux store
5. **Minification**: Production builds minified
6. **Tree Shaking**: Unused code eliminated
7. **Serverless**: Auto-scaling backend on Vercel

---

This infrastructure provides a scalable, secure, and performant platform for the Starflix streaming application.

