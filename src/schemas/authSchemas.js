import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ required_error: 'El email es obligatorio' }),
  password: z.string({ required_error: 'La contraseña es obligatoria' })
});

// individual validators
const nameValidator = z.string({
  required_error: 'El nombre es obligatorio'
})
  .regex(/^[\p{L}\s]+$/u, {
    message: 'El nombre solo puede contener letras'
  });

const lastNameValidator = z.string({
  required_error: 'El apellido es obligatorio'
})
  .regex(/^[\p{L}\s]+$/u, {
    message: 'El apellido solo puede contener letras'
  });

const emailValidator = z.email({ error: 'Ingrese un email válido' });

const passwordValidator = z.string({
  required_error: 'La contraseña es obligatoria'
})
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula' })
  .regex(/[0-9]/, { message: 'Debe contener al menos un número' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Debe contener al menos un carácter especial (ej. !@#$%^&*)'
  });

// esquema base, definiciones de tipos
const baseUserSchema = z.object({
  name: nameValidator,
  lastName: lastNameValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: z.string({ required_error: 'Debes confirmar tu contraseña' })
});

// aplicamos el refine, matchear contraseñas
export const registerSchema = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }
);

export const updateUserSchema = baseUserSchema
  .partial() // ¡Ahora sí funciona! Porque baseUserSchema es un ZodObject
  .refine(
    (data) => {
      // si el usuario intentó actualizar AL MENOS UNA de las contraseñas
      if (data.password !== undefined || data.confirmPassword !== undefined) {
        // entonces ambas deben existir y coincidir.
        return data.password === data.confirmPassword;
      }

      return true;
    },
    {
      message: "Debes enviar y confirmar la nueva contraseña para actualizarla, revisa que ambas coincidan",
      path: ["confirmPassword"],
    }
  );