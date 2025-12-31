const mongoose = require('mongoose');
const config = require('../config/environment');

// Connection configuration constants
const CONNECTION_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true
};

const CONNECTION_MESSAGES = {
  SUCCESS: '✅ MongoDB connection successful',
  ERROR: '❌ MongoDB connection error:',
  MISSING_URL: 'URL_MONGODB not defined in environment variables',
  RETRYING: '🔄 Retrying connection...',
  MAX_RETRIES: '❌ Maximum connection retries reached'
};

const CONNECTION_PARAMS = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 5000
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

