# API Endpoints Reference

## Authentication
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token JWT
- `POST /api/auth/2fa/enable` - Activar 2FA
- `POST /api/auth/2fa/verify` - Verificar 2FA
- `POST /api/auth/switch-role` - Cambiar rol activo

## Users
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## Roles
- `GET /api/roles` - Listar todos los roles
- `GET /api/roles/:id` - Obtener rol por ID
- `POST /api/roles` - Crear nuevo rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

## Menus
- `GET /api/menus` - Listar todos los menús
- `GET /api/menus/:id` - Obtener menú por ID
- `POST /api/menus` - Crear nuevo menú
- `PUT /api/menus/:id` - Actualizar menú
- `DELETE /api/menus/:id` - Eliminar menú

## Projects
- `GET /api/projects` - Listar proyectos del usuario
- `GET /api/projects/:id` - Obtener proyecto por ID
- `POST /api/projects` - Crear nuevo proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

## Tasks
- `GET /api/tasks` - Listar tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
