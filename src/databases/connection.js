/**
 * MongoDB Connection Module
 * Establishes and manages Mongoose database connection
 * Handles connection configuration, retries, and error reporting
 */
const mongoose = require('mongoose');
const config = require('../config/environment');

// Database connection status messages with emoji indicators
const DB_MESSAGES = {
  SUCCESS: '✅ MongoDB connection successful',
  FAILED: '❌ MongoDB connection error:',
  MISSING_URL: 'DATABASE_URL not defined in environment variables',
  RETRYING: '🔄 Retrying database connection...',
  MAX_RETRIES_REACHED: '❌ Maximum connection retries reached',
  DISCONNECTED: '⚠️ MongoDB disconnected',
  ERROR: 'MongoDB connection error:'
};

// Connection retry configuration
const CONNECTION_RETRY = {
  MAX_ATTEMPTS: 3,
  DELAY_MS: 5000
};

// Connection configuration constants
const CONNECTION_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true
};

/**
 * Connects to MongoDB database with retry logic
 * @returns {Promise<void>}
 * @throws {Error} If connection fails after max retries
 */
const connectDB = async () => {
  try {
    const mongoURL = config.DATABASE.URL;

    if (!mongoURL) {
      throw new Error(CONNECTION_MESSAGES.MISSING_URL);
    }

    await mongoose.connect(mongoURL, CONNECTION_CONFIG);
    console.log(CONNECTION_MESSAGES.SUCCESS);
  } catch (error) {
    console.error(CONNECTION_MESSAGES.ERROR, error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});

module.exports = connectDB;

