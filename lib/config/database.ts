/**
 * Database configuration
 * Centralized MongoDB connection configuration
 */

// Connection state (mutable)
let connectionState = false;

export const databaseConfig = {
  uri: process.env.MONGODB_URI || process.env.MONGODB_URI_DEV || 'mongodb://localhost:27017/finman',
  
  // Connection pool settings
  options: {
    maxPoolSize: 10, // Maximum number of connections in pool
    minPoolSize: 5, // Minimum number of connections
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    heartbeatFrequencyMS: 10000, // Heartbeat every 10 seconds
    retryWrites: true,
    retryReads: true,
    // Disable mongoose buffering (bufferMaxEntries is deprecated in newer Mongoose versions)
    bufferCommands: false,
  },
  
  // Getter for connection state
  get isConnected() {
    return connectionState;
  },
  
  // Setter for connection state
  set isConnected(value: boolean) {
    connectionState = value;
  },
} as const;

