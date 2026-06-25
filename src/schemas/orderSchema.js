import { z } from 'zod';

// Schema para cada item del pedido que envía el cliente
const orderItemSchema = z.object({
    id: z
        .string({ required_error: 'El id del producto es obligatorio' }),
    quantity: z
        .number({ required_error: 'La cantidad es obligatoria' })
        .int('La cantidad debe ser un número entero')
        .min(1, 'La cantidad debe ser al menos 1')
});

// El cliente envía items + billing_details; el servicio resuelve precios y calcula totales
export const createOrderSchema = z.object({
    items: z
        .array(orderItemSchema, { required_error: 'El campo items es obligatorio' })
        .min(1, 'La orden debe contener al menos un item'),
    billing_details: z.object({
        name: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().min(1),
        paymentMethod: z.enum(['cash', 'card', 'virtual_wallet'], {
            errorMap: () => ({ message: "El método de pago debe ser 'cash', 'card' o 'virtual_wallet'" })
        }),
    })
});

// Al actualizar una orden solo se pueden modificar total, state y/o billing_details
export const updateOrderSchema = z.object({
    total: z.number().min(0, 'El total debe ser mayor o igual a 0').optional(),
    state: z.enum(['pending', 'ready', 'cancel'], {
        errorMap: () => ({ message: "El estado debe ser 'pending', 'ready' o 'cancel'" })
    }).optional(),
    billing_details: z.object({
        name: z.string().min(1, 'El nombre es obligatorio'),
        lastName: z.string().min(1, 'El apellido es obligatorio'),
        email: z.string().email('Email inválido'),
        phone: z.string().min(1, 'El teléfono es obligatorio'),
        address: z.string().min(1, 'La dirección es obligatoria'),
        city: z.string().min(1, 'La ciudad es obligatoria'),
        postalCode: z.string().min(1, 'El código postal es obligatorio'),
    }).optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debes enviar al menos un campo para actualizar' }
);
