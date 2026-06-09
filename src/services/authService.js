import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import AppError from '../utils/AppError.js';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export const login = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Las credenciales son obligatorias', 400);
  }

  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    throw new AppError('Revise las credenciales ingresadas', 401);
  }

  // comparar la contraseña ingresada con el hash guardado
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // construir el payload (lo que irá dentro del token)
  const payload = {
    id: user.id,
    roles: user.roles
  };

  // generar y firmar Tokens
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '2h' // el token vence en 2 horas
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d' // el refresh token vence en 7 días
  });

  // parsear a objeto plano y eliminar el password antes de responder
  const userResponse = user.toJSON();
  delete userResponse.password;

  // retornar el token y los datos del usuario
  return {
    token,
    refreshToken,
    user: userResponse
  };
};

export const updateUserPassword = async (id, password) => {
  if (!id) {
    throw new AppError('El id es obligatorio', 400);
  }
  if (!password) {
    throw new AppError('La contraseña es obligatoria', 400);
  }

  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    throw new AppError('La contraseña debe ser diferente a la actual', 400);
  }

  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  await user.save();

  const userResponse = user.toJSON();
  delete userResponse.password;

  return userResponse;
};

export const register = async (name, lastName, email, password) => {
  if (!name || !lastName || !email || !password) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  const userExist = await User.findOne({ where: { email } });

  if (userExist) {
    throw new AppError('No se puede registrar el correo electrónico, intentelo con uno diferente', 409);
  }

  // hashear la contraseña 
  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    last_name: lastName,
    email,
    password: hashedPassword,
  });

  // limpiar el usuario 
  const userResponse = newUser.toJSON();
  delete userResponse.password;

  return userResponse;
};

export const refreshToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new AppError('Refresh token no proporcionado.', 401);
  }

  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    const { id, roles } = decoded
    const payload = { id, roles }

    // generar nuevos tokens
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h' // el token vence en 2 horas
    });
    const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d' // el token vence en 7 días
    });

    return {
      token,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expirado.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Refresh token inválido.', 401);
    }
    throw error;
  }
}