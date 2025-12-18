const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURL = process.env.URL_MONGODB;

    if (!mongoURL) {
      throw new Error('URL_MONGODB not defined in environment variables');
    }

    await mongoose.connect(mongoURL);
    console.log('✅ MongoDB connection successful');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
