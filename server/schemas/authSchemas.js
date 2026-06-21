import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters long')
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = registerSchema;
