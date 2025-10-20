# 🚀 Supabase Setup Guide for Starflix

## Why Supabase?
- ✅ **Frontend-compatible** - Works directly from React
- ✅ **No CORS issues** - Designed for web apps
- ✅ **Free tier** - 500MB database, 2GB bandwidth
- ✅ **Real-time** - Live updates
- ✅ **Easy setup** - No backend needed

## Quick Setup Steps:

### 1. Create Supabase Account
- Go to: https://supabase.com
- Click "Start your project"
- Sign up with GitHub/Google (faster)

### 2. Create New Project
- Click "New Project"
- Organization: Personal (or create new)
- Project name: `starflix`
- Database password: Generate secure password (SAVE IT!)
- Region: Choose closest to you
- Click "Create new project"

### 3. Get Your Credentials
- Go to Settings → API
- Copy your **Project URL** and **anon public** key
- Example:
  ```
  Project URL: https://abcdefgh.supabase.co
  anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### 4. Update Your App Configuration
- Open `src/database/supabase.js`
- Replace the values:
  ```javascript
  const supabaseUrl = 'https://your-project.supabase.co';
  const supabaseKey = 'your-anon-key';
  ```

### 5. Create Database Tables
Go to SQL Editor in Supabase and run this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  firebase_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favourites table
CREATE TABLE favourites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  title TEXT,
  name TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date TEXT,
  first_air_date TEXT,
  vote_average DECIMAL,
  overview TEXT,
  genre_ids INTEGER[],
  media_type TEXT DEFAULT 'movie',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create watchlist table
CREATE TABLE watchlist (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  title TEXT,
  name TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date TEXT,
  first_air_date TEXT,
  vote_average DECIMAL,
  overview TEXT,
  genre_ids INTEGER[],
  media_type TEXT DEFAULT 'movie',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create reviews table
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  movie_title TEXT,
  movie_poster TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (allow users to access their own data)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = firebase_id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = firebase_id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = firebase_id);

CREATE POLICY "Users can view own favourites" ON favourites FOR SELECT USING (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
CREATE POLICY "Users can insert own favourites" ON favourites FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
CREATE POLICY "Users can delete own favourites" ON favourites FOR DELETE USING (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));

CREATE POLICY "Users can view own watchlist" ON watchlist FOR SELECT USING (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
CREATE POLICY "Users can insert own watchlist" ON watchlist FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
CREATE POLICY "Users can delete own watchlist" ON watchlist FOR DELETE USING (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));

CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (user_id IN (SELECT id FROM users WHERE firebase_id = auth.uid()::text));
```

### 6. Test Your Setup
- Restart your dev server: `npm run dev`
- Go to Personal page
- Click "🔍 Debug MongoDB Atlas" (will test Supabase)
- Check console for connection logs

## What You Should See:
- ✅ Supabase Data Service initialized
- ✅ Successfully connected to Supabase
- ✅ Test query successful

Your favourites and watchlist will now be stored in Supabase cloud database! 🚀✨

## Benefits:
- **Real-time sync** across devices
- **Automatic backups**
- **Scalable** - grows with your app
- **Secure** - Row Level Security enabled
- **Fast** - Global CDN




