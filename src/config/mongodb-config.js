// MongoDB Atlas Configuration
// This file is now deprecated - use environment variables instead

export const MONGODB_CONFIG = {
  // Use environment variable instead of hardcoded connection string
  connectionString: process.env.MONGODB_URI
};

// Instructions:
// 1. Set MONGODB_URI environment variable in Vercel dashboard
// 2. For local development, create .env file with MONGODB_URI
// 3. Never commit actual connection strings to version control
