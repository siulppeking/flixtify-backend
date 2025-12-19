# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.0.0] - 2025-12-19

### Added
- Autenticación JWT con refresh tokens
- Autenticación de dos factores (2FA) con TOTP
- Gestión completa de roles y permisos
- Gestión de proyectos y tareas
- Sistema de menús dinámicos por rol
- Documentación API con Swagger/OpenAPI
- Validación de datos con express-validator
- CORS configurado

### Changed
- Refactorización completa del código base
- Estandarización de mensajes de error
- Mejora de estructura de carpetas

### Security
- Contraseñas hasheadas con bcryptjs
- JWT tokens con expiración configurable
- Validación de acceso por rol
