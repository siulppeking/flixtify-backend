# Guía de Contribución

Gracias por tu interés en contribuir.

## Requisitos / Setup
- Usa Node.js 20.x (ver `.nvmrc`).
- Ejecuta `npm install` para instalar dependencias.
- Crea un `.env` desde `.env.example` y completa los valores.

## Flujo de trabajo
1. Haz fork del repositorio.
2. Crea una rama de feature desde `main` (`git checkout -b feature/mi-feature`).
3. Realiza commits siguiendo Conventional Commits.
4. Haz push a tu rama (`git push origin feature/mi-feature`).
5. Abre un Pull Request.

## Desarrollo
- Inicia en modo dev: `npm run dev`.
- Estilo de código: Prettier + ESLint (ver configuraciones).

## Estándares de Código
- Usar ESLint para linting.
- Mantener consistencia con el código existente.
- Agregar pruebas para nuevas funcionalidades.
- Documentar cambios en el README si es necesario.

## Commits
Usar formato Conventional Commits:
- `feat:` nuevas características
- `fix:` correcciones de bugs
- `refactor:` refactorizaciones
- `docs:` documentación
- `chore:` tareas de mantenimiento
- `test:` pruebas

## Pull Requests
- Describe claramente los cambios y enlaza issues relacionados.
- Mantén los cambios enfocados y mínimos.

## Seguridad
- No comprometas secretos. `.env` está ignorado.
- Reporta vulnerabilidades vía SECURITY.md.
