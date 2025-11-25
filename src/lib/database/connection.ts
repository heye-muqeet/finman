/**
 * MongoDB Connection Utility
 * Handles Mongoose connection to MongoDB with proper error handling and event listeners
 */

import mongoose from 'mongoose';
import { databaseConfig } from '@/lib/config/database';

let isConnecting = false;

/**
 * Connect to MongoDB database
 * @returns Promise<void>
 */
export async function connectDB(): Promise<void> {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    return;
  }

  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    databaseConfig.isConnected = true;
    return;
  }

  isConnecting = true;

  try {
    // Connect to MongoDB
    await mongoose.connect(databaseConfig.uri, databaseConfig.options);
    
    databaseConfig.isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.db?.databaseName}`);
    console.log(`   Host: ${mongoose.connection.host}`);
  } catch (error) {
    databaseConfig.isConnected = false;
    isConnecting = false;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  } finally {
    isConnecting = false;
  }
}

/**
 * Disconnect from MongoDB database
 * @returns Promise<void>
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    databaseConfig.isConnected = false;
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

/**
 * Get current connection state
 * @returns boolean
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  databaseConfig.isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  databaseConfig.isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  databaseConfig.isConnected = false;
});

// Handle process termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

// Export mongoose for model definitions
export { mongoose };

