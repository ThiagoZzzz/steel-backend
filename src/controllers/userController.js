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
import ApiQueryFeature, { USER_CONFIG } from '../utils/ApiQueryFeatures.js';

export const getAllUsersController = catchAsync(async (req, res) => {
    const queryOptions = new ApiQueryFeature(req.query, USER_CONFIG)
        .filter()
        .search()
        .sort()
        .paginate()
        .build();

    const { users, total } = await getAllUsers(queryOptions);

    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || USER_CONFIG.defaultLimit, 100);

    res.status(200).json({
        status: 'success',
        message: 'Listado de usuarios obtenido correctamente',
        data: { users },
        meta: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit,
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
    if (lastName !== undefined) updateData.last_name = lastName;
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
