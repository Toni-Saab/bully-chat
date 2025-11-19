// apps/chat-assistant/src/(lib)/auth/reset-password.schema.ts
import { z } from 'zod';
import { emailField } from './common.schema';

export const resetPasswordSchema = z.object({
  email: emailField,
});

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;