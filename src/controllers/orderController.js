import {
  getAllOrders,
  getOrderById,
  getOrderItems,
  createFullOrder,
  updateOrder,
  deleteOrder
} from '../services/orderService.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllOrdersController = catchAsync(async (req, res) => {
  const orders = await getAllOrders();

  return res.status(200).json({
    status: 'success',
    message: 'Listado de órdenes obtenido correctamente',
    data: { orders },
    meta: {
      totalItems: orders.length
    }
  });
});

export const getOrderByIdController = catchAsync(async (req, res) => {
  // El middleware verifyOrderOwnership ya verificó la propiedad y adjuntó la orden
  const order = req.order;

  return res.status(200).json({
    status: 'success',
    message: 'Orden obtenida correctamente',
    data: { order }
  });
});

// el admin puede acceder a cualquier orden
export const getOrderByIdAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await getOrderById(id);

  return res.status(200).json({
    status: 'success',
    message: 'Orden obtenida correctamente',
    data: { order }
  });
});

export const getOrderItemsController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const orderItems = await getOrderItems(id);

  return res.status(200).json({
    status: 'success',
    message: 'Items de la orden obtenidos correctamente',
    data: { orderItems }
  });
});

export const createOrderController = catchAsync(async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'La orden debe contener al menos un item.'
    });
  }

  const user_id = req.user.id;

  // El servicio resuelve precios desde la DB, calcula sub_totals y
  // persiste Order + OrderItems dentro de una transacción atómica.
  const { order, items: newItems } = await createFullOrder({ user_id, items });

  return res.status(201).json({
    status: 'success',
    message: 'Orden creada correctamente',
    data: { order, items: newItems }
  });
});

export const updateOrderController = catchAsync(async (req, res) => {
  const { total, state } = req.body;
  const { id } = req.params;

  // Construimos un objeto solo con los campos que realmente vinieron
  const updateData = {};
  if (total !== undefined) updateData.total = total;
  if (state !== undefined) updateData.state = state;

  const updatedOrder = await updateOrder(id, updateData);

  return res.status(200).json({
    status: 'success',
    message: 'Orden actualizada correctamente',
    data: { order: updatedOrder }
  });
});

export const deleteOrderController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await deleteOrder(id);

  return res.status(200).json({
    status: 'success',
    message: 'Orden eliminada correctamente',
    data: { order }
  });
});