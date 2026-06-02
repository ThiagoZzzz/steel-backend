import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

// set cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // solo HTTPS en prod
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en ms (igual que el token)
}

export const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  // guardar refreshToken
  res.cookie('refreshToken', result.refreshToken, cookieOptions);

  res.status(200).json({
    status: 'success',
    message: 'Inicio de sesión exitoso',
    data: { token: result.token, user: result.user }
  });
});

export const logoutController = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json({
    status: 'success',
    message: 'Cierre de sesión exitoso'
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

export const refreshController = catchAsync(async (req, res) => {
  const newTokens = await authService.refreshToken(req.cookies.refreshToken)

  // guardar nuevo refreshToken
  res.cookie('refreshToken', newTokens.refreshToken, cookieOptions)
  res.status(200).json({
    status: 'success',
    message: 'Nuevos tokens obtenidos correctamente',
    accessToken: newTokens.token
  });
})