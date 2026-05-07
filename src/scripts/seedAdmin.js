// src/scripts/seedAdmin.js
// Script de uso único para crear el administrador principal.
// Ejecutar manualmente desde la carpeta /server:
//   node src/scripts/seedAdmin.js
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import sequelize from '../config/db.js';

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash('Password123!', 10);

        await User.create({
            name: 'Example',
            last_name: 'User',
            email: 'user@example.com',
            password: hashedPassword,
            roles: ['user', 'admin']
        });

        console.log('✅ Admin creado exitosamente');
    } catch (error) {
        console.error('❌ Error al crear el admin:', error.message);
    } finally {
        await sequelize.close(); // Cierra la conexión limpiamente
        process.exit(0);         // Solo se llama cuando el script corre solo
    }
};

export default seedAdmin;