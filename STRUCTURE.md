# Estructura del Proyecto

```
flixtify-backend/
├── src/
│   ├── controllers/        # Lógica de negocio
│   ├── models/             # Esquemas de Mongoose
│   ├── routes/             # Definición de rutas
│   ├── middlewares/        # Middlewares personalizados
│   ├── validators/         # Validadores de entrada
│   └── databases/          # Configuración de BD
├── index.js               # Punto de entrada
├── package.json           # Dependencias
├── .env.example           # Variables de entorno ejemplo
├── swagger.yaml           # Documentación API
└── README.md              # Documentación principal
```

## Descripción de Carpetas

### Controllers
Contienen la lógica de negocio para cada recurso (User, Role, Project, etc.)

### Models
Definen los esquemas de MongoDB usando Mongoose

### Routes
Configuran los endpoints de la API

### Middlewares
Autenticación, validación y control de acceso

### Validators
Reglas de validación de datos usando express-validator
