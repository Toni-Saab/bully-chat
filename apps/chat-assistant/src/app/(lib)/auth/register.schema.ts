// apps/chat-assistant/src/(lib)/auth/register.schema.ts
import { z } from 'zod';
import { checkUsernameUnique } from '@event-bot/data-access';
import { emailField, passwordField, confirmPasswordField } from './common.schema';

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username is too long')
    .refine(async (username) => await checkUsernameUnique(username), {
      message: 'Username is already taken. Please choose another.',
    }),

  email: emailField,
  password: passwordField,
  confirmPassword: confirmPasswordField,
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
.refine((data) => data.password.toLowerCase() !== data.email.toLowerCase(), {
  message: 'Password cannot be the same as your email',
  path: ['password'],
});

export type TRegisterSchema = z.infer<typeof registerSchema>;