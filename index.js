// Main Application Entry Point - Express server initialization with routing and middleware
require('dotenv').config();

// Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./src/config/environment');
const apiMessages = require('./src/constants/apiMessages');

// Database
const connectDB = require('./src/databases/connection');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const roleMenuRoutes = require('./src/routes/roleMenuRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const userManagementRoutes = require('./src/routes/userManagementRoutes');
const userRoleRoutes = require('./src/routes/userRoleRoutes');
const userRoutes = require('./src/routes/userRoutes');

const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
const PORT = config.SERVER.PORT;

// Middleware setup
app.use(morgan(config.LOGGING.FORMAT));
app.use(express.json());
app.use(cors());

// Initialize database
connectDB();

// Routes

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: apiMessages.GENERAL_MESSAGES.WELCOME,
    status: apiMessages.GENERAL_MESSAGES.OK
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
if (config.SERVER.NODE_ENV === 'development') {
  console.log('📝 Swagger UI mounted at /api-docs (Development)');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log('✅ Swagger UI disabled in this environment.');
}

// Server startup
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
