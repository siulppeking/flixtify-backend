// Main Application Entry Point - Express server initialization with routing and middleware
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./src/databases/connection');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const roleMenuRoutes = require('./src/routes/roleMenuRoutes');
const userRoleRoutes = require('./src/routes/userRoleRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const userRoutes = require('./src/routes/userRoutes');
const userManagementRoutes = require('./src/routes/userManagementRoutes');

const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Initialize database
connectDB();

// Routes

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a Flixtify Backend v1',
    status: 'ok'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/roleMenus', roleMenuRoutes);
app.use('/api/userRoles', userRoleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', userManagementRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Swagger documentation
if (process.env.NODE_ENV === 'development') {
  console.log('📝 Swagger UI mounted at /api-docs (Development)');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log('✅ Swagger UI disabled in this environment.');
}

// Server startup
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
