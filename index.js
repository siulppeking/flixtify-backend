require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./src/databases/connection');
const cors = require('cors');
const authRoutes = require("./src/routes/authRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const roleMenuRoutes = require("./src/routes/roleMenuRoutes");
const userRoleRoutes = require("./src/routes/userRoleRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const userManagementRoutes = require("./src/routes/userManagementRoutes"); // Nueva línea
const swaggerUi = require('swagger-ui-express'); // Importación 1
const YAML = require('yamljs');                  // Importación 2

const swaggerDocument = YAML.load('./swagger.yaml'); // Asegúrate de ajustar la ruta
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
connectDB();

// Routes

// Ruta raíz
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenido a Flixtify Backend",
        status: "ok"
    });
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/roleMenus", roleMenuRoutes);
app.use("/api/userRoles", userRoleRoutes);

// Rutas de administración
app.use("/api/admin/users", userManagementRoutes); // Nueva línea

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// --- Control Condicional de la Documentación Swagger ---
if (process.env.NODE_ENV === 'development') { // <--- CLAVE DE CONTROL
    console.log('📝 Montando Swagger UI en /api-docs (Entorno de Desarrollo)');

    // Ruta de Documentación SWAGGER/OPENAPI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
    console.log('✅ Swagger UI deshabilitado en este entorno.');
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
});
