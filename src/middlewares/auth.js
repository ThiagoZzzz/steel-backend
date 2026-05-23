import jwt from 'jsonwebtoken';

// * Authentication - authN
export const verifyToken = (req, res, next) => {
  // 1. Buscamos el token en los headers (formato estándar: "Bearer eyJhbG...")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  // 2. Extraemos solo el string del token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificamos la firma y la fecha de expiración usando la clave del .env
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Inyectamos los datos del usuario en el request para que el siguiente controlador los pueda usar
    req.user = decodificado;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' }); // ← 401 para que el interceptor actúe
    }
    // Si el token expiró o fue modificado jwt.verify lanza un error
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// * Authorization - authZ
export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ error: 'Acceso denegado. Requiere autorización.' });
    }

    const userRoles = req.user.roles ?? [];

    // Verificar si al menos uno de los roles del usuario está entre los permitidos
    const hasPermission = userRoles.some(r => allowedRoles.includes(r));

    if (!hasPermission) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta.' });
    }

    next();
  }
}

// * Ownership simple - Verifica que el :id de la URL coincida con el usuario autenticado
// Útil para rutas de usuario donde el :id ES el ID del usuario (ej: GET /users/:id)
export const verifyOwnership = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Acceso denegado. Requiere autenticación de propiedad.' });
  }

  const { id } = req.params;

  if (req.user.id !== id) {
    return res.status(403).json({ error: 'Operación denegada. No tienes permiso para acceder o modificar los datos de otro usuario.' });
  }

  next();
}

// * Resource-based Ownership - Verifica que el usuario autenticado sea dueño de la orden
// Requiere consultar la DB porque el :id de la URL es el ID de la orden, no del usuario.
// Adjunta req.order para que el controlador no tenga que volver a buscarla (evita doble query).
export const verifyOrderOwnership = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Acceso denegado. Requiere autenticación.' });
    }

    // Importación dinámica para evitar dependencia circular (middleware → modelo)
    const { Order } = await import('../models/index.js');

    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada.' });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Operación denegada. Esta orden no te pertenece.' });
    }

    // Adjuntamos la orden al request para que el controlador no tenga que volver a buscarla
    req.order = order;

    next();
  } catch (error) {
    next(error);
  }
};
