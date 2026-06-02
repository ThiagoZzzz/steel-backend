import { sequelize, Order, OrderItem, Product } from "../models/index.js";
import AppError from '../utils/AppError.js';

export const getAllOrders = async () => {
    return await Order.findAll({
        raw: true
    });
}

export const getAllUserOrders = async (userId) => {
    return await Order.findAll({
        where: {
            user_id: userId
        },
        raw: true
    });
}

export const getOrderById = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const order = await Order.findByPk(id);

    if (!order) {
        throw new AppError('Orden no encontrada', 404);
    }

    return order;
}

export const getOrderItems = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const orderItems = await OrderItem.findAll({
        where: { order_id: id },
        raw: true
    });

    if (!orderItems) {
        throw new AppError('No se encontraron items para la orden', 404);
    }

    return orderItems;
}

// Crea la orden completa dentro de una transacción: calcula sub_total por item y total de la orden, persiste Order + OrderItems de forma atómica
export const createFullOrder = async ({ user_id, user_email, items, billing_details }) => {
    return await sequelize.transaction(async (t) => {

        // Resolver precios y calcular sub_totals en paralelo
        const resolvedItems = await Promise.all(
            items.map(async ({ product_id, quantity, name }) => {
                const product = await Product.findByPk(product_id, { transaction: t });

                if (!product) {
                    throw new AppError(`Producto con id "${product_id}" no encontrado.`, 404);
                }

                return {
                    product_id,
                    product_name: name,
                    quantity,
                    sub_total: product.price * quantity
                };
            })
        );

        // Sumar todos los sub_totals para obtener el total de la orden
        const total = resolvedItems.reduce((acc, item) => acc + item.sub_total, 0);

        // Crear la orden
        const newOrder = await Order.create({ ...billing_details, total, user_id, user_email }, { transaction: t });

        // Crear los items asociados a la orden
        const newItems = await OrderItem.bulkCreate(
            resolvedItems.map(item => ({ ...item, order_id: newOrder.id })),
            { transaction: t }
        );

        return { order: newOrder, items: newItems };
    });
}

// recibe un objeto con los campos mapeados
export const updateOrder = async (id, updateData) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const order = await Order.findByPk(id);

    if (!order) {
        throw new AppError('Orden no encontrada', 404);
    }

    // Solo actualizará lo que venga dentro de updateData.
    await order.update(updateData);

    return order;
}

export const deleteOrder = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const order = await Order.findByPk(id);

    if (!order) {
        throw new AppError('Orden no encontrada', 404);
    }

    await order.destroy();
    return order;
}