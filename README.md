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
