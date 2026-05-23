import { Router } from 'express';
// validación de datos
import { loginController, refreshController, registerController, updateUserPasswordController } from '../controllers/authController.js';
import { loginSchema, registerSchema, updateUserSchema } from '../schemas/authSchemas.js';
// middlewares
import { validateSchema } from '../middlewares/schemaValidator.js';
import { verifyToken, verifyOwnership } from '../middlewares/auth.js';

const router = Router();

// públicas
router.post('/sign-up', validateSchema(registerSchema), registerController);
router.post('/login', validateSchema(loginSchema), loginController);
router.post('/refresh', refreshController);

// protegidas
router.patch('/password/:id', verifyToken, verifyOwnership, validateSchema(updateUserSchema), updateUserPasswordController);

export default router
