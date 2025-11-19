// apps/chat-assistant/src/(lib)/auth/common.schema.ts
import { z } from 'zod';

export const emailField = z
  .string()
  .toLowerCase()
  .trim()
  .min(1, 'Email address is required')
  .max(100, 'Email address is too long')
  .regex(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    'Invalid email: only English letters, numbers, symbols.'
  );

export const passwordField = z
  .string()
  .trim()
  .min(6, 'Password must be at least 6 characters long')
  .max(50, 'Password is too long')
  .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)');

export const confirmPasswordField = z.string().trim().min(1, 'Confirm Password is required');