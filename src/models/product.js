const initProduct = (client, DataTypes) => {
  const Product = client.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    discount: { type: DataTypes.BOOLEAN, defaultValue: false },
    category: { type: DataTypes.TEXT },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'products',
    createdAt: 'created_at',
    updatedAt: false
  });

  return Product
}

export default initProduct;