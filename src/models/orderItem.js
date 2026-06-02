const initOrderItem = (client, DataTypes) => {
  const OrderItem = client.define('OrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_name: { type: DataTypes.TEXT, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    sub_total: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    tableName: 'order_items',
    timestamps: true
  });

  return OrderItem;
}

export default initOrderItem;