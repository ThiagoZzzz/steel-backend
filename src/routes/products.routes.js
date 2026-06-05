import { Router } from "express";
// controllers
import { getAllProductsController, getProductByIdController, getProductBySlugController, createProductController, updateProductController, deleteProductController } from '../controllers/productController.js';
// validación de datos
import { validateSchema } from '../middlewares/schemaValidator.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';
// auth y roles
import { verifyToken, verifyRole } from '../middlewares/auth.js';
// upload media middleware (2 pasos: parsear FormData en memoria -> subir a Cloudinary)
import { parseFormData, uploadToCloudinary } from '../middlewares/uploadMedia.js';

// router
const router = Router();

router.get('/', getAllProductsController);
router.get('/search/:slug', getProductBySlugController);
router.get('/:id', getProductByIdController);
// * ROL: ADMIN
router.post('/', verifyToken, verifyRole('admin'), parseFormData.single('image'), validateSchema(createProductSchema), uploadToCloudinary, createProductController)
router.patch('/:id', verifyToken, verifyRole('admin'), parseFormData.single('image'), validateSchema(updateProductSchema), uploadToCloudinary, updateProductController)
router.delete('/:id', verifyToken, verifyRole('admin'), deleteProductController)
// TODO
// router.get('/stats',) // --> retorna datos de usuarios, ordenes, productos. CREAR UNA VISTA GENERAL DEL SISTEMA

export default router;
