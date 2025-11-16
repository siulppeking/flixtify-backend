const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURL = process.env.URL_MONGODB;
    
    if (!mongoURL) {
      throw new Error('URL_MONGODB no está definida en las variables de entorno');
    }

    await mongoose.connect(mongoURL);
    console.log('✅ Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
