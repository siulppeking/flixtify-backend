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

## API Docs (Swagger)

Este proyecto incluye documentación de la API en Swagger.

- Archivo: `swagger.yaml`
- Visualización: Cuando el servidor está corriendo, la UI de Swagger está disponible en `/api-docs`.

### Cómo acceder

1. Inicia el servidor (`npm run dev` o `npm start`).
2. Abre tu navegador en `http://localhost:3000/api-docs`.

## Variables de entorno

Las siguientes variables están disponibles (ver `.env.example`):

- `URL_MONGODB`: cadena de conexión a MongoDB.
- `PORT`: puerto de la aplicación.
- `JWT_SECRET`: clave para firmar JWT.
- `JWT_REFRESH_SECRET`: clave para refrescar JWT.
- `NODE_ENV`: entorno (`development`, `production`).

## Seguridad

- No compartas el archivo `.env`.
- Asegúrate de que `.env` esté ignorado por Git (ver `.gitignore`).
