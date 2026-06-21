import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty'),
  content: z
    .string()
    .optional()
    .default(''),
});

export const updateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .optional(),
  content: z
    .string()
    .optional(),
});

export const shareDocumentSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(1, 'Username cannot be empty'),
});
