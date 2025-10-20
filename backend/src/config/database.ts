import mongoose from 'mongoose';

/**
 * MongoDB Connection Configuration
 * 
 * TODO: Customize connection options
 * - Add connection pooling settings
 * - Add replica set configuration
 * - Add SSL/TLS settings for production
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-credit-exchange';

// Connection options
// TODO: Adjust based on your deployment environment
const options = {
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 2,
  
  // Timeout settings
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  
  // Monitoring
  heartbeatFrequencyMS: 10000,
  
  // TODO: Add authentication if required
  // auth: {
  //   username: process.env.MONGODB_USER,
  //   password: process.env.MONGODB_PASSWORD,
  // },
  
  // TODO: Add SSL/TLS for production
  // tls: true,
  // tlsCAFile: '/path/to/ca-certificate.crt',
};

export const connectDB = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    
    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    // TODO: Implement retry logic or fallback
    process.exit(1);
  }
};

// Create indexes on startup
// TODO: Add custom indexes based on your query patterns
export const createIndexes = async (): Promise<void> => {
  try {
    console.log('Creating MongoDB indexes...');
    
    // Import models to trigger index creation
    await import('../models/carbonCredit');
    await import('../models/marketplaceListing');
    await import('../models/transaction');
    await import('../models/user');
    
    // Ensure indexes are created
    await mongoose.connection.syncIndexes();
    
    console.log('✅ MongoDB indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

// Health check
export const checkDBHealth = async (): Promise<boolean> => {
  try {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    return state === 1;
  } catch (error) {
    return false;
  }
};

export default {
  connectDB,
  disconnectDB,
  createIndexes,
  checkDBHealth,
};
