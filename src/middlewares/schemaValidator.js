import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

export const validateSchema = (schema) => {
  return (req, res, next) => {
    console.log(req.body);

    try {
      // Intenta forzar el req.body a encajar en el molde (schema)
      schema.parse(req.body);

      next();
    } catch (error) {
      // Verifica si el error atrapado es realmente de Zod
      if (error instanceof ZodError) {

        const errorMessages = error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message
        }));

        const appError = new AppError(
          `Errores de validación: ${errorMessages.map((e) => e.mensaje).join('. ')}`,
          400
        );
        appError.errors = errorMessages;

        return next(appError);
      }

      // Si es otro tipo de error, lo pasamos al errorHandler
      return next(error);
    }
  };
};