// Database Connection Test Script
// Run this to verify your MongoDB Atlas connection

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Test connection
async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Close connection
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
