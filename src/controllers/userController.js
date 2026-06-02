import {
    getUserById,
    getAllUsers,
    deleteUser,
    updateUserRole,
    revokeUserRole,
    updateUser,
    getUserOrders
} from '../services/userService.js';
import catchAsync from '../utils/catchAsync.js';

// TODO implementar filtros y paginación
export const getAllUsersController = catchAsync(async (req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
        status: 'success',
        message: 'Listado de usuarios obtenido correctamente',
        data: { users },
        meta: {
            totalItems: users.length
        }
    });
});

export const getUserByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;

    const user = await getUserById(id);
    res.status(200).json({
        status: 'success',
        message: 'Perfil de usuario obtenido correctamente',
        data: { user }
    });
});

export const deleteUserController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await deleteUser(id);
    res.status(200).json({
        status: 'success',
        message: 'Usuario eliminado correctamente',
        data: { user }
    });
});

// UPDATES
export const updateUserController = catchAsync(async (req, res) => {
    const { id } = req.params;

    // 1. Extraemos solo lo que sabemos que existe en el producto
    const { name, lastName, email } = req.body;

    // 2. Armamos un objeto limpio y dinámico
    let updateData = {};

    if (name !== undefined) updateData.name = name;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;

    // 3. Le pasamos ese objeto limpio al servicio
    const updatedUser = await updateUser(id, updateData);

    res.status(200).json({
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: { user: updatedUser }
    });
});

export const updateUserRoleController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await updateUserRole(id, role);

    res.status(200).json({
        status: 'success',
        message: 'Rol de usuario actualizado correctamente',
        data: { user: updatedUser }
    });
});

export const revokeUserRoleController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await revokeUserRole(id, role);

    res.status(200).json({
        status: 'success',
        message: 'Rol de usuario revocado correctamente',
        data: { user: updatedUser }
    });
});

// ORDERS
export const getUserOrdersController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const orders = await getUserOrders(id);

    res.status(200).json({
        status: 'success',
        message: 'Pedidos del usuario obtenidos correctamente',
        data: { orders },
        meta: {
            totalItems: orders.length
        }
    });
});
