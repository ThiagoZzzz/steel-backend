import { Sequelize } from "sequelize";

// Cliente base de datos
export const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;