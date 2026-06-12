import { User, Order } from '../models/index.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] },
        raw: true
    });

    return users;
}

export const getUserById = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        raw: true
    });

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    return user;
}

export const deleteUser = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    await user.destroy();
    return user;
}

// * UPDATES
// recibe un objeto con los campos mapeados
export const updateUser = async (id, updateData) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    // Solo actualizará lo que venga dentro de updateData.
    await user.update(updateData);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return userResponse;
}

export const updateUserRole = async (id, role) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }
    if (!role) {
        throw new AppError('El rol es obligatorio', 400);
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    if (user.roles.includes(role)) {
        throw new AppError(`El usuario ya tiene el rol '${role}'`, 400);
    }

    user.roles = [...user.roles, role];
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    return userResponse;
}

export const revokeUserRole = async (id, role) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }
    if (!role) {
        throw new AppError('El rol es obligatorio', 400);
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    if (!user.roles.includes(role)) {
        throw new AppError(`El usuario no tiene el rol '${role}'`, 400);
    }


    if (user.roles.length === 1) {
        throw new AppError('El usuario debe tener al menos un rol asignado', 400);
    }

    user.roles = user.roles.filter(r => r !== role);
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    return userResponse;
}

// * ORDERS
export const getUserOrders = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const orders = await Order.findAll({
        where: { user_id: id },
        raw: true,
        order: [
            ['created_at', 'DESC']
        ]
    });

    return orders;
}