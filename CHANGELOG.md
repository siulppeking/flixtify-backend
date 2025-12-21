# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [Unreleased]
- Actualizar y detallar cambios a medida que se publiquen.

## [1.0.0] - 2025-12-20

### Added
- Autenticación JWT con refresh tokens.
- Autenticación de dos factores (2FA) con TOTP.
- Gestión completa de roles y permisos.
- Gestión de proyectos y tareas.
- Sistema de menús dinámicos por rol.
- Documentación API con Swagger/OpenAPI.
- Validación de datos con express-validator.
- CORS configurado.

### Changed
- Refactorización del código base y estructura de carpetas.
- Estandarización de mensajes de error.

### Security
- Contraseñas hasheadas con bcryptjs.
- JWT tokens con expiración configurable.
- Validación de acceso por rol.
