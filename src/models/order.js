const initOrder = (client, DataTypes) => {
  const Order = client.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    total: { type: DataTypes.FLOAT, allowNull: false },
    state: { type: DataTypes.ENUM('pending', 'ready', 'cancel'), defaultValue: 'pending', allowNull: false },
    payment_method: { type: DataTypes.ENUM('cash', 'card', 'virtual_wallet'), defaultValue: 'cash', allowNull: false }
  }, {
    tableName: 'orders',
    createdAt: 'created_at',
    updatedAt: false
  });

  return Order;
}

export default initOrder;