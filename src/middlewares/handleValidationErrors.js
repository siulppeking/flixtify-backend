// src/middlewares/handleValidationErrors.js

const { validationResult } = require('express-validator');

/**
 * Middleware que verifica los errores de validación recolectados por express-validator.
 * Si hay errores, detiene la ejecución y devuelve una respuesta 400.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    // Si la lista de errores no está vacía, devuelve el error 400
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: 'Validation failed.',
            errors: errors.array() // Devuelve un array con todos los detalles del error
        });
    }

    // Si no hay errores, pasa al siguiente middleware o al controlador
    next();
};

module.exports = handleValidationErrors;