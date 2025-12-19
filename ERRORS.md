# API Error Handling Guide

## Error Codes y Respuestas

### 400 - Bad Request
Solicitud inválida o faltan parámetros requeridos.

### 401 - Unauthorized
Token JWT inválido, expirado o faltante.

### 403 - Forbidden
El usuario no tiene permisos para acceder al recurso.

### 404 - Not Found
Recurso no encontrado.

### 500 - Server Error
Error interno del servidor.

## Response Format

```json
{
  "message": "Descripción del error",
  "status": 400,
  "errors": []
}
```
