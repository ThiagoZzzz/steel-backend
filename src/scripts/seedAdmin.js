// Script de uso único para crear el administrador principal.

// Ejecutar desde la carpeta /server con:
//   node --env-file=.env src/scripts/seedAdmin.js
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import sequelize from '../config/db.js';

const password = process.env.ADMIN_PASSWORD || 'AdminSecure1234!';
const email = process.env.ADMIN_EMAIL || 'admin@system.com';

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name: 'Admin',
            last_name: 'System',
            email: email,
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

seedAdmin();
