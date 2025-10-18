// MongoDB configuration for Starflix
// Using MongoDB Atlas (cloud)

import mongoose from 'mongoose';
import { MONGODB_CONFIG } from '../config/mongodb-config.js';

// MongoDB connection string
const MONGODB_URI = MONGODB_CONFIG.connectionString;

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB');
      return;
    }

    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Disconnect from MongoDB
export const disconnectFromMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};

export default mongoose;
