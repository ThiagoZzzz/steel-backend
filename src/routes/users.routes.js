import { Router } from 'express';
// controladores
import {
    getUserByIdController,
    getAllUsersController,
    deleteUserController,
    updateUserController,
    updateUserRoleController,
    revokeUserRoleController,
    getUserOrdersController
} from '../controllers/userController.js';
// validación de datos
import { validateSchema } from '../middlewares/schemaValidator.js';
import { updateUserSchema } from '../schemas/authSchemas.js';
// auth y roles
import { verifyToken, verifyRole, verifyOwnership } from '../middlewares/auth.js';

const router = Router();

// * RUTAS DE DATOS PERSONALES
router.get('/:id', verifyToken, verifyRole('user'), verifyOwnership, getUserByIdController);
router.get('/:id/orders', verifyToken, verifyRole('user'), verifyOwnership, getUserOrdersController);
router.patch('/:id', verifyToken, verifyRole('user'), verifyOwnership, validateSchema(updateUserSchema), updateUserController);

// * ROL: ADMIN
router.get('/', verifyToken, verifyRole('admin'), getAllUsersController)
router.patch('/:id/role', verifyToken, verifyRole('admin'), updateUserRoleController)
router.patch('/:id/revoke-role', verifyToken, verifyRole('admin'), revokeUserRoleController)
router.delete('/:id', verifyToken, verifyRole('admin'), deleteUserController)

export default router;