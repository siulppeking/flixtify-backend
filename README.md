# Flixtify Backend

Backend de la aplicación Flixtify construido con Express y MongoDB.

## Requisitos

- Node.js v16+
- MongoDB Atlas cuenta

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
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
- `npm test` - Ejecutar tests

## Características

- ✅ Express.js para el servidor
- ✅ MongoDB con Mongoose para la base de datos
- ✅ Morgan para logging HTTP
- ✅ Nodemon para desarrollo con reinicio automático
- ✅ Variables de entorno con dotenv

## Estructura del proyecto

```
src/
├── controllers/    # Controladores de rutas
├── databases/      # Configuración de base de datos
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de Mongoose
├── routers/        # Definición de rutas
└── utils/          # Funciones utilitarias
```

## Tecnologías

- [Express](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) - Base de datos
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Nodemon](https://nodemon.io/) - Monitor de cambios para desarrollo
- [dotenv](https://github.com/motdotla/dotenv) - Variables de entorno

## Licencia

ISC
