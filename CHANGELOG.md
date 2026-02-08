# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [Unreleased]

### Planned
- Tests automatizados para controladores
- Integración con CI/CD
- Rate limiting para endpoints sensibles
- Caché con Redis

## [1.1.0] - 2026-02-07

### Added
- Documentación mejorada de configuración
- Comentarios en archivos de configuración
- Sección de seguridad en README

### Changed
- Mejora en estructura del código
- Actualización de scripts en package.json

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
