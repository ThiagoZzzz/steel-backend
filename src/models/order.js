import { generateOrderNumber } from "../utils/nanoIds.js";

const initOrder = (client, DataTypes) => {
  const Order = client.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_number: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      defaultValue: () => generateOrderNumber()
    },
    state: {
      type: DataTypes.ENUM('pending', 'ready', 'cancel'),
      defaultValue: 'pending',
      allowNull: false
    },
    billing_details: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    user_email: { type: DataTypes.TEXT, allowNull: false },
    payment_method: {
      type: DataTypes.ENUM('cash', 'card', 'virtual_wallet'),
      defaultValue: 'cash',
      allowNull: false
    },
    total: { type: DataTypes.FLOAT, allowNull: false },
  }, {
    tableName: 'orders',
    createdAt: 'created_at',
    updatedAt: false,
  });

  return Order;
}

export default initOrder;