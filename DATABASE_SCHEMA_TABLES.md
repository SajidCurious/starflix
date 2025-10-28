# Starflix Database Schema Tables

## Database Overview
- **Database Type**: MongoDB Atlas (NoSQL Document Database)
- **Cluster**: Starflix-cluster
- **Collections**: 4 main collections
- **Authentication**: Firebase Auth integration

---

## 1. Users Collection

| Field Name | Data Type | Required | Unique | Default | Description/Comment |
|------------|-----------|----------|--------|---------|---------------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | MongoDB's primary key, automatically generated unique identifier |
| `firebaseId` | String | Yes | Yes | - | Firebase Authentication UID, serves as the bridge between Firebase Auth and MongoDB |
| `email` | String | Yes | No | - | User's email address, used for account identification and communication |
| `name` | String | Yes | No | - | User's display name, shown throughout the application interface |
| `avatar` | String | No | No | - | URL to user's profile picture, optional field for personalization |
| `createdAt` | Date | Yes | No | Date.now | Timestamp when the user account was created, useful for analytics |

### Sample User Document:
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "firebaseId": "firebase_user_123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## 2. Favourites Collection

| Field Name | Data Type | Required | Unique | Default | Description/Comment |
|------------|-----------|----------|--------|---------|---------------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | MongoDB's primary key for the favourites document |
| `userId` | ObjectId | Yes | No | - | Reference to Users collection, establishes one-to-one relationship |
| `movies` | Array | Yes | No | [] | Array of movie objects that the user has marked as favourites |
| `updatedAt` | Date | Yes | No | Date.now | Timestamp of last modification to the favourites list |

### Movies Array Structure (within Favourites):

| Field Name | Data Type | Required | Default | Description/Comment |
|------------|-----------|----------|---------|---------------------|
| `movieId` | Number | Yes | - | TMDB movie ID, unique identifier from The Movie Database API |
| `title` | String | No | - | Movie title, used for display purposes |
| `name` | String | No | - | TV show name (alternative to title for TV series) |
| `poster_path` | String | No | - | Relative path to movie poster image from TMDB |
| `backdrop_path` | String | No | - | Relative path to movie backdrop image for hero sections |
| `release_date` | String | No | - | Movie release date in YYYY-MM-DD format |
| `first_air_date` | String | No | - | TV show first air date (alternative to release_date) |
| `vote_average` | Number | No | - | Average rating from TMDB (0-10 scale) |
| `overview` | String | No | - | Movie/TV show plot summary and description |
| `genre_ids` | Array[Number] | No | [] | Array of genre IDs from TMDB for categorization |
| `media_type` | String | No | 'movie' | Type of content: 'movie' or 'tv' |
| `addedAt` | Date | Yes | Date.now | Timestamp when this movie was added to favourites |

### Sample Favourites Document:
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "movies": [
    {
      "movieId": 550,
      "title": "Fight Club",
      "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "backdrop_path": "/87hTDiay2N2qWyX4D7C5b7hUjF5.jpg",
      "release_date": "1999-10-15",
      "vote_average": 8.433,
      "overview": "A ticking-time-bomb insomniac...",
      "genre_ids": [18],
      "media_type": "movie",
      "addedAt": ISODate("2024-01-15T11:00:00Z")
    }
  ],
  "updatedAt": ISODate("2024-01-15T11:00:00Z")
}
```

---

## 3. Watchlist Collection

| Field Name | Data Type | Required | Unique | Default | Description/Comment |
|------------|-----------|----------|--------|---------|---------------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | MongoDB's primary key for the watchlist document |
| `userId` | ObjectId | Yes | No | - | Reference to Users collection, establishes one-to-one relationship |
| `movies` | Array | Yes | No | [] | Array of movie objects that the user wants to watch later |
| `updatedAt` | Date | Yes | No | Date.now | Timestamp of last modification to the watchlist |

### Movies Array Structure (within Watchlist):
*Note: The movies array structure is identical to the Favourites collection*

| Field Name | Data Type | Required | Default | Description/Comment |
|------------|-----------|----------|---------|---------------------|
| `movieId` | Number | Yes | - | TMDB movie ID, unique identifier from The Movie Database API |
| `title` | String | No | - | Movie title, used for display purposes |
| `name` | String | No | - | TV show name (alternative to title for TV series) |
| `poster_path` | String | No | - | Relative path to movie poster image from TMDB |
| `backdrop_path` | String | No | - | Relative path to movie backdrop image for hero sections |
| `release_date` | String | No | - | Movie release date in YYYY-MM-DD format |
| `first_air_date` | String | No | - | TV show first air date (alternative to release_date) |
| `vote_average` | Number | No | - | Average rating from TMDB (0-10 scale) |
| `overview` | String | No | - | Movie/TV show plot summary and description |
| `genre_ids` | Array[Number] | No | [] | Array of genre IDs from TMDB for categorization |
| `media_type` | String | No | 'movie' | Type of content: 'movie' or 'tv' |
| `addedAt` | Date | Yes | Date.now | Timestamp when this movie was added to watchlist |

### Sample Watchlist Document:
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "movies": [
    {
      "movieId": 13,
      "title": "Forrest Gump",
      "poster_path": "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      "backdrop_path": "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
      "release_date": "1994-06-23",
      "vote_average": 8.5,
      "overview": "A man with a low IQ has accomplished great things...",
      "genre_ids": [35, 18, 10749],
      "media_type": "movie",
      "addedAt": ISODate("2024-01-15T13:00:00Z")
    }
  ],
  "updatedAt": ISODate("2024-01-15T13:00:00Z")
}
```

---

## 4. Reviews Collection

| Field Name | Data Type | Required | Unique | Default | Description/Comment |
|------------|-----------|----------|--------|---------|---------------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | MongoDB's primary key for the review document |
| `userId` | ObjectId | Yes | No | - | Reference to Users collection, identifies who wrote the review |
| `movieId` | Number | Yes | No | - | TMDB movie ID, identifies which movie/TV show is being reviewed |
| `movieTitle` | String | No | No | - | Movie title for display purposes, cached for performance |
| `moviePoster` | String | No | No | - | Movie poster URL, cached for display in review lists |
| `rating` | Number | Yes | No | - | User's rating (1-5 stars), validated to be within range |
| `reviewText` | String | No | No | - | User's written review, maximum 1000 characters |
| `createdAt` | Date | Yes | No | Date.now | Timestamp when the review was first created |
| `updatedAt` | Date | Yes | No | Date.now | Timestamp when the review was last modified |

### Sample Review Document:
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "movieId": 550,
  "movieTitle": "Fight Club",
  "moviePoster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "rating": 5,
  "reviewText": "An absolute masterpiece! The plot twists are incredible and the cinematography is stunning. Brad Pitt and Edward Norton deliver outstanding performances.",
  "createdAt": ISODate("2024-01-15T12:00:00Z"),
  "updatedAt": ISODate("2024-01-15T12:00:00Z")
}
```

---

## Database Relationships Summary

| Relationship Type | Parent Collection | Child Collection | Foreign Key | Description |
|-------------------|-------------------|------------------|-------------|-------------|
| **One-to-One** | Users | Favourites | `userId` | Each user has exactly one favourites list |
| **One-to-One** | Users | Watchlist | `userId` | Each user has exactly one watchlist |
| **One-to-Many** | Users | Reviews | `userId` | Each user can write multiple reviews |

---

## Indexes for Performance Optimization

| Collection | Index Field(s) | Type | Purpose |
|------------|----------------|------|---------|
| Users | `firebaseId` | Unique | Fast user lookup by Firebase ID |
| Users | `email` | Regular | Fast user lookup by email |
| Favourites | `userId` | Regular | Fast favourites retrieval by user |
| Watchlist | `userId` | Regular | Fast watchlist retrieval by user |
| Reviews | `userId` | Regular | Fast review retrieval by user |
| Reviews | `movieId` | Regular | Fast review retrieval by movie |
| Reviews | `userId`, `movieId` | Compound | Prevent duplicate reviews per user per movie |

---

## Data Validation Rules

| Collection | Field | Validation Rule | Purpose |
|------------|-------|-----------------|---------|
| Users | `firebaseId` | Must be unique, non-empty string | Ensure one-to-one mapping with Firebase |
| Users | `email` | Valid email format | Ensure proper email structure |
| Users | `name` | Non-empty string | Ensure user has display name |
| Movies | `movieId` | Positive integer | Ensure valid TMDB ID |
| Movies | `media_type` | 'movie' or 'tv' | Ensure proper content type |
| Reviews | `rating` | 1-5 inclusive | Ensure valid rating range |
| Reviews | `reviewText` | Max 1000 characters | Prevent excessively long reviews |

---

## Environment Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/starflix` |
| `DB_NAME` | Database name | `starflix` |
| `CLUSTER_NAME` | MongoDB Atlas cluster name | `Starflix-cluster` |

This schema design provides a robust foundation for the Starflix application, supporting user management, personalization features, and social interactions while maintaining data integrity and optimal performance.


