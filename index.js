require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./src/databases/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: '¡Servidor de Flixtify funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
});
