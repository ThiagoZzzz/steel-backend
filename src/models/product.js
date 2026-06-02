import { generateSlug } from '../utils/generateSlug.js'
import { nanoIdSufixGenerator } from '../utils/nanoIds.js'

const initProduct = (client, DataTypes) => {
  const Product = client.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
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
    updatedAt: false,
    hooks: {
      beforeValidate: (product) => {
        if (!product.slug) {
          const slugName = generateSlug(product.name);
          const sufixId = nanoIdSufixGenerator();
          product.slug = `${slugName}-${sufixId}`;
        }
      },
      beforeUpdate: (product) => {
        if (product.changed('name')) {
          const slugName = generateSlug(product.name);
          const sufixId = nanoIdSufixGenerator();
          product.slug = `${slugName}-${sufixId}`;
        }
      }
    }
  });

  return Product
}

export default initProduct;