const mongoose = require('mongoose');

// Constants for database connection
const MONGODB_URL_ENV = 'URL_MONGODB';
const CONNECTION_SUCCESS_MSG = '✅ MongoDB connection successful';
const CONNECTION_ERROR_MSG = '❌ MongoDB connection error:';
const MISSING_URL_ERROR = 'URL_MONGODB not defined in environment variables';
const EXIT_CODE = 1;

/**
 * Connects to MongoDB database using connection string from environment variables
 * @returns {Promise<void>}
 * @throws {Error} If connection fails or URL is not defined
 */
const connectDB = async () => {
  try {
    const mongoURL = process.env[MONGODB_URL_ENV];

    if (!mongoURL) {
      throw new Error(MISSING_URL_ERROR);
    }

    await mongoose.connect(mongoURL);
    console.log(CONNECTION_SUCCESS_MSG);
  } catch (error) {
    console.error(CONNECTION_ERROR_MSG, error.message);
    process.exit(EXIT_CODE);

module.exports = connectDB;
