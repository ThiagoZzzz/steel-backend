// ! EJECUTAR COMANDO ANTES DE LEER ARCHIVOS DE APP EN EL DOCKER PARA PARSEAR VARIABLES DE ENTORNO node -r dotenv/config server.js
// configurar variables de entorno antes que inicie el server
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// db
import { sequelize } from './models/index.js';

// routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';
import orderRoutes from './routes/orders.routes.js';

// error handling
import { errorHandler } from './middlewares/errorHandler.js';
import AppError from './utils/AppError.js';

const app = express();

// setear valores de desarrollo
const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// cors
app.use(
    cors({
        origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:8000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    })
);

// cookie parser
app.use(cookieParser());

// limite de payload
app.use(express.json({ limit: '10mb' }));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/orders', orderRoutes);

// swagger docs (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const swaggerDocument = YAML.load(join(__dirname, 'docs', 'swagger.yaml'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customSiteTitle: 'STEEL API Docs',
        customCss: '.swagger-ui .topbar { display: none }'
    }));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta no encontrada
app.all('/{*path}', (req, res, next) => {
    next(new AppError(`No se encontró la ruta ${req.originalUrl}`, 404));
});

// Middleware centralizado de errores — SIEMPRE AL FINAL
app.use(errorHandler);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');

        // sincroniza los modelos con la base de datos
        await sequelize.sync({ force: false });

        const server = app.listen(PORT, () => {
            console.log(`Server running on ${HOST}:${PORT}`);
        });

        server.timeout = 30000;

    } catch (error) {
        console.error('Error al iniciar el servidor o conectar con DB:', error);
    }
};

startServer();