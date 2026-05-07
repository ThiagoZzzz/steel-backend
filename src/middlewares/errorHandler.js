import AppError from '../utils/AppError.js';

// errores de validación de Sequelize (ej: campos que no cumplen reglas del modelo).
const handleSequelizeValidationError = (err) => {
    const errors = err.errors.map((e) => ({
        campo: e.path,
        mensaje: e.message
    }));
    const message = `Datos inválidos: ${errors.map((e) => e.mensaje).join('. ')}`;
    const error = new AppError(message, 400);
    error.errors = errors;
    return error;
};

// errores de restricción única de Sequelize (ej: email duplicado).
const handleSequelizeUniqueConstraintError = (err) => {
    const fields = err.errors.map((e) => e.path).join(', ');
    const errors = err.errors.map((e) => ({
        campo: e.path,
        mensaje: e.message
    }));
    const message = `El valor del campo '${fields}' ya existe`;
    const error = new AppError(message, 409);
    error.errors = errors;
    return error;
};

// errores genéricos de base de datos de Sequelize.
const handleSequelizeDatabaseError = (err) => {
    return new AppError('Error interno de base de datos', 500);
};

// middleware centralizado, maneja errores de lógica de negocio (AppError), de base de datos (Sequelize) e inesperados.
export const errorHandler = (err, req, res, next) => {
    // Valores por defecto para errores inesperados
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Clonar el error para no mutar el original
    let error = { ...err, message: err.message, name: err.name };

    // --- Errores de Sequelize ---
    if (error.name === 'SequelizeValidationError') {
        error = handleSequelizeValidationError(err);
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        error = handleSequelizeUniqueConstraintError(err);
    }

    if (error.name === 'SequelizeDatabaseError') {
        error = handleSequelizeDatabaseError(err);
    }

    // --- Construir la respuesta ---
    const response = {
        status: error.status || 'error',
        message: error.message
    };

    // Incluir detalles de errores de validación si existen
    if (error.errors) {
        response.errors = error.errors;
    }

    // Log en desarrollo para debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error('❌ Error:', {
            statusCode: error.statusCode || 500,
            message: error.message,
            stack: err.stack,
            ...(error.errors && { errors: error.errors })
        });
    } else if (!error.isOperational) {
        // En producción, solo loguear errores inesperados (no operacionales)
        console.error('❌ ERROR INESPERADO:', err);
    }

    // Si es un error no operacional en producción, ocultar detalles al cliente
    if (process.env.NODE_ENV === 'production' && !error.isOperational) {
        response.message = 'Error interno del servidor';
    }

    res.status(error.statusCode || 500).json(response);
};
