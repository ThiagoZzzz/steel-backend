import { Sequelize } from "sequelize";

// Cliente base de datos
// Parse DATABASE_URL format: postgres://user:password@host:port/dbname?schema=public
const DATABASE_URL = process.env.DATABASE_CONNECTION_STRING;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL no está definido en las variables de entorno');
}

// Parsear la URL
const urlParams = new URL(DATABASE_URL);
const username = urlParams.username;
const password = urlParams.password;
const host = urlParams.hostname;
const port = urlParams.port;
const dbName = urlParams.pathname.substring(1);
const schema = urlParams.searchParams.get('schema') || 'public';

// config, ssl required for production
const sslConfig = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

console.log('Conectando a PostgreSQL...', {
  host,
  port,
  database: dbName,
  schema,
  user: username
});

// Crear instancia de Sequelize
const sequelize = new Sequelize(dbName, username, password, {
  host: host,
  port: port,
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production' ? sslConfig : {},
  logging: false, // Deshabilitar logging de SQL
});

export default sequelize;