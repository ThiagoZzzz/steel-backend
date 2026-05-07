import { z } from 'zod';

// z.coerce convierte automáticamente los strings que llegan de multipart/form-data al tipo de dato esperado en la db
export const createProductSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
    stock: z.coerce.number().min(0, 'El stock debe ser mayor o igual a 0').optional(),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    // 'image' no se valida aquí: viene de req.file (Multer/Cloudinary), no de req.body
    category: z.string().min(3, 'La categoría debe tener al menos 3 caracteres'),
    discount: z.coerce.boolean().optional(),
    featured: z.coerce.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();
