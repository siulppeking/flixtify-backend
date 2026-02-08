# Guía de Contribución

¡Gracias por tu interés en contribuir! Nos encanta recibir mejoras, reportes de bugs y feedback.

## Consideraciones Importantes

- No comprometas secretos o credenciales.
- Sigue las convenciones de código existentes.
- Escribe commits claros y descriptivos.
- Prueba tu código antes de hacer push.

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

- **Linting**: Usa ESLint para validar el código (`npm run lint`).
- **Formato**: Formatea con Prettier antes de hacer commit (`npm run format`).
- **Consistencia**: Mantén consistencia con el código existente.
- **Nombres**: USA camelCase para variables/funciones, PascalCase para clases.
- **Documentación**: Documenta funciones públicas y cambios importantes.
- **Pruebas**: Agrega tests cuando sea posible (actualmente en desarrollo).

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

### Antes de enviar un PR
1. Asegúrate de que tu código pasa `npm run lint` y `npm run format`.
2. Prueba los cambios localmente.
3. Actualiza documentación si es necesario.

### Descripción del PR
- **Título**: Breve y descriptivo (idealmente comienza con tipo: `feat:`, `fix:`, etc).
- **Descripción**: Explica **por qué** se hace el cambio, no solo **qué**.
- **Enlaces**: Vincula issues relacionados con `Closes #123` o `Related to #456`.
- **Cambios**: Lista los cambios principales o afecciones.

### Revisión
- Responde a comentarios de revisores.
- Sé abierto al feedback y mejoras sugeridas.
- Requerimos __al menos 1 aprobación__ antes de mergear.

## Seguridad
- No comprometas secretos. `.env` está ignorado.
- Reporta vulnerabilidades vía SECURITY.md.
