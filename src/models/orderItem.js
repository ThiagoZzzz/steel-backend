const initOrderItem = (client, DataTypes) => {
  const OrderItem = client.define('OrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    sub_total: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    tableName: 'order_items',
    timestamps: false
  });

  return OrderItem;
}

export default initOrderItem;