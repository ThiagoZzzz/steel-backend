import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

export const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    message: 'Inicio de sesión exitoso',
    data: result
  });
});

export const registerController = catchAsync(async (req, res) => {
  const { name, lastName, email, password } = req.body;

  const result = await authService.register(name, lastName, email, password);

  res.status(201).json({
    status: 'success',
    message: 'Usuario registrado correctamente',
    data: result
  });
});

export const updateUserPasswordController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const updatedUser = await authService.updateUserPassword(id, password);

  res.status(200).json({
    status: 'success',
    message: 'Contraseña actualizada correctamente',
    data: { user: updatedUser }
  });
});