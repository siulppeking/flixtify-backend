// Main Application Entry Point - Express server initialization with routing and middleware
require('dotenv').config();

// Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Database
const connectDB = require('./src/databases/connection');

// Routes - Auth & Access Control
const authRoutes = require('./src/routes/authRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const roleMenuRoutes = require('./src/routes/roleMenuRoutes');
const userRoleRoutes = require('./src/routes/userRoleRoutes');

// Routes - Users & Administration
const userRoutes = require('./src/routes/userRoutes');
const userManagementRoutes = require('./src/routes/userManagementRoutes');

// Routes - Core Resources
const projectRoutes = require('./src/routes/projectRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const menuRoutes = require('./src/routes/menuRoutes');

// Application configuration constants
const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_FORMAT: 'dev'
};

// API route paths
const API_ROUTES = {
  AUTH: '/api/auth',
  ROLES: '/api/roles',
  ROLE_MENUS: '/api/roleMenus',
  USER_ROLES: '/api/userRoles',
  USERS: '/api/users',
  ADMIN_USERS: '/api/admin/users',
  PROJECTS: '/api/projects',
  TASKS: '/api/tasks',
  MENUS: '/api/menus'
};

// Swagger configuration
const swaggerDocument = YAML.load('./swagger.yaml');

// Initialize Express application
const app = express();

// Middleware setup
app.use(morgan(APP_CONFIG.LOG_FORMAT));
app.use(express.json());
app.use(cors());

// Initialize database connection
connectDB();

/**
 * Health check endpoint
 * @route GET /
 * @returns {Object} Server status
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a Flixtify Backend v1',
    status: 'ok'
  });
});

/**
 * API Route Registration
 * Organizes routes by functional domain
 */

// Auth & Access Control Routes
app.use(API_ROUTES.AUTH, authRoutes);
app.use(API_ROUTES.ROLES, roleRoutes);
app.use(API_ROUTES.ROLE_MENUS, roleMenuRoutes);
app.use(API_ROUTES.USER_ROLES, userRoleRoutes);

// User & Administration Routes
app.use(API_ROUTES.USERS, userRoutes);
app.use(API_ROUTES.ADMIN_USERS, userManagementRoutes);

// Core Resource Routes
app.use(API_ROUTES.PROJECTS, projectRoutes);
app.use(API_ROUTES.TASKS, taskRoutes);
app.use(API_ROUTES.MENUS, menuRoutes);

/**
 * Swagger/OpenAPI Documentation
 * Conditionally enabled based on environment
 */
if (APP_CONFIG.NODE_ENV === 'development') {
  console.log('📝 Swagger UI mounted at /api-docs (Development)');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log('✅ Swagger UI disabled in this environment.');
}

/**
 * Server Initialization
 * Start Express server and listen on configured port
 */
app.listen(APP_CONFIG.PORT, () => {
  console.log(`🚀 Server running on port ${APP_CONFIG.PORT}`);
});
