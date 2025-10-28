// MongoDB Atlas Connection Test
import { connectToMongoDB } from '../database/mongodb.js';
import { mongoDataService } from './mongoDataService.js';

export const testMongoDBAtlas = async () => {
  try {
    console.log('🧪 Testing MongoDB Atlas connection...');
    
    // Test connection
    await connectToMongoDB();
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    // Test data service initialization
    await mongoDataService.init();
    console.log('✅ MongoDB Data Service initialized');
    
    // Test a simple operation
    const testResult = await mongoDataService.getFavourites('test-user-id');
    console.log('✅ Test query successful:', testResult);
    
    return { 
      success: true, 
      message: 'MongoDB Atlas connection successful!' 
    };
    
  } catch (error) {
    console.error('❌ MongoDB Atlas test failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};






