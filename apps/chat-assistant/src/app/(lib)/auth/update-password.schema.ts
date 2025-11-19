// apps/chat-assistant/src/(lib)/auth/update-password.schema.ts
import { z } from 'zod';
import { passwordField, confirmPasswordField } from './common.schema';

export const updatePasswordSchema = z.object({
  password: passwordField,
  confirmPassword: confirmPasswordField,
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type TUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;