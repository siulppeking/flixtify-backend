# Flixtify Backend

Backend API de la aplicación Flixtify construido con Express, MongoDB y Node.js. Sistema completo de gestión de proyectos y tareas con autenticación segura.

## Características Principales

- Autenticación JWT con tokens refresh
- Autenticación de dos factores (2FA)
- Gestión de roles y permisos
- Gestión de proyectos y tareas
- API REST completamente documentada con Swagger

## Requisitos

- Node.js v20.x (verificar con `.nvmrc`)
- MongoDB Atlas cuenta activa o instancia local de MongoDB
- npm o yarn instalado

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/siulppeking/flixtify-backend.git
cd flixtify-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` desde el template:
```bash
cp .env.example .env
```

4. Completar las variables de entorno en `.env` con tus valores:
```bash
# Edita .env con tus credenciales de MongoDB y secretos JWT
nano .env
```

## Uso / Ejecución

### Modo Desarrollo (con Hot Reload)
```bash
npm run dev
```
Inicia el servidor con nodemon, que se reinicia automáticamente al detectar cambios.

### Modo Producción
```bash
npm start
```
Inicia el servidor en modo producción optimizado.

## Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon para reload automático
- `npm start` - Inicia el servidor en modo producción
- `npm run lint` - Ejecuta ESLint para análisis estático del código
- `npm run format` - Formatea el código con Prettier

## Tecnologías

- [Express](https://expressjs.com/) - Framework web Node.js minimalista
- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL escalable
- [Mongoose](https://mongoosejs.com/) - ODM (Object Data Modeling) para MongoDB
- [JWT](https://jwt.io/) - Autenticación basada en tokens JSON Web Tokens
- [Speakeasy](https://github.com/speakeasyjs/speakeasy) - TOTP para autenticación 2FA
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Hash seguro de contraseñas
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Nodemon](https://nodemon.io/) - Monitor automático de cambios para desarrollo
- [dotenv](https://github.com/motdotla/dotenv) - Gestión de variables de entorno

## API Docs (Swagger/OpenAPI)

Este proyecto incluye documentación interactiva de la API usando Swagger UI.

- Definición: `swagger.yaml` (formato OpenAPI 3.0.0)
- URL de acceso: Cuando el servidor está corriendo, accede a `/api-docs`

### Cómo acceder a la documentación

1. Inicia el servidor (`npm run dev` o `npm start`).
2. Abre tu navegador en `http://localhost:3000/api-docs`.
3. Explora todos los endpoints disponibles y pruébalos interactivamente.

## Variables de Entorno Disponibles

Las siguientes variables están disponibles y deben configurarse en `.env` (consulta `.env.example`):

- `URL_MONGODB`: Cadena de conexión a MongoDB (Atlas o local).
- `PORT`: Puerto del servidor (por defecto 3000).
- `JWT_SECRET`: Clave secreta para firmar JWT (acceso).
- `JWT_REFRESH_SECRET`: Clave secreta para refrescar JWT.
- `NODE_ENV`: Entorno (`development` o `production`).

## Despliegue e Infraestructura

### Requisitos de Producción
- Node.js v20.x
- MongoDB 6.0+ (recomendado Atlas o instancia dedicada)
- HTTPS/SSL certificados
- Variables de entorno configuradas en el servidor

### Próximo: Docker Support
Se planea agregar soporte para Docker (Dockerfile y docker-compose.yml).

## Seguridad y Mejores Prácticas

- **No compartas el archivo `.env`** - Contiene credenciales y secretos sensibles.
- **Asegúrate de que `.env` esté ignorado por Git** - Verificar en `.gitignore`.
- **Usa secretos JWT fuertes** - Mínimo 32 caracteres, aleatorios.
- **Rotación de secretos** - Cambiar JWT_SECRET periódicamente en producción.
- **HTTPS en producción** - Usar certificados SSL/TLS.
- **Reporta vulnerabilidades privadamente** - Ver `SECURITY.md`.
