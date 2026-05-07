import { DataTypes } from "sequelize";
// cliente db (conexión)
import sequelize from "../config/db.js";

// incializadores de modelos
import initUser from "./user.js";
import initProduct from "./product.js";
import initOrder from "./order.js";
import initOrderItem from "./orderItem.js";

// modelos
const User = initUser(sequelize, DataTypes);
const Product = initProduct(sequelize, DataTypes);
const Order = initOrder(sequelize, DataTypes);
const OrderItem = initOrderItem(sequelize, DataTypes);

// relaciones
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

export { sequelize, User, Product, Order, OrderItem };
