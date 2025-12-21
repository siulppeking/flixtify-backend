# Flixtify Backend

Backend API de la aplicación Flixtify construido con Express, MongoDB y Node.js.

## Características

- Autenticación JWT con tokens refresh
- Autenticación de dos factores (2FA)
- Gestión de roles y permisos
- Gestión de proyectos y tareas
- API REST completamente documentada con Swagger

## Requisitos

- Node.js v16 o superior
- MongoDB Atlas cuenta activa

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

3. Crear archivo `.env`:
```bash
cp .env.example .env
```

4. Completar las variables de entorno en `.env`:
```
URL_MONGODB=tu_url_de_mongodb
PORT=3000
```

## Uso

### Desarrollo
```bash
npm run dev
```
Inicia el servidor con nodemon, que se reinicia automáticamente al detectar cambios.

### Producción
```bash
npm start
```
Inicia el servidor en modo producción.

## Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción

## Tecnologías

- [Express](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) - Base de datos
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Nodemon](https://nodemon.io/) - Monitor de cambios para desarrollo
- [dotenv](https://github.com/motdotla/dotenv) - Variables de entorno

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
