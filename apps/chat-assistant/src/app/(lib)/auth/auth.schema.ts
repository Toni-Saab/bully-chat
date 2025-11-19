// apps/chat-assistant/src/(lib)/auth/login.schema.ts
import { z } from 'zod';
import { emailField } from './common.schema';

export const loginSchema = z.object({
  email: emailField,
  password: z.string().trim().min(1, 'Password is required'),
});

export type TLoginSchema = z.infer<typeof loginSchema>;