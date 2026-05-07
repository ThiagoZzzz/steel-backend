import { Router } from "express"
// controllers
import {
    getAllOrdersController,
    getOrderByIdController,
    getOrderByIdAdminController,
    getOrderItemsController,
    createOrderController,
    updateOrderController,
    deleteOrderController
} from '../controllers/orderController.js';
// validación de datos
import { validateSchema } from '../middlewares/schemaValidator.js';
import { createOrderSchema, updateOrderSchema } from '../schemas/orderSchema.js';
// auth y roles
import { verifyToken, verifyRole, verifyOrderOwnership } from '../middlewares/auth.js';

const router = Router();

// usuario autenticado
router.post('/', verifyToken, verifyRole('user'), validateSchema(createOrderSchema), createOrderController)
// solo el usuario dueño de la orden puede accederla
router.get('/:id', verifyToken, verifyRole('user'), verifyOrderOwnership, getOrderByIdController)
router.get('/:id/items', verifyToken, verifyRole('user'), verifyOrderOwnership, getOrderItemsController)

// * ROL: ADMIN
router.get('/', verifyToken, verifyRole('admin'), getAllOrdersController)
router.get('/:id/admin', verifyToken, verifyRole('admin'), getOrderByIdAdminController)
// solo el un admin puede actualizar el total y el estado de una orden
router.patch('/:id', verifyToken, verifyRole('admin'), validateSchema(updateOrderSchema), updateOrderController)
router.delete('/:id', verifyToken, verifyRole('admin'), deleteOrderController)

export default router;