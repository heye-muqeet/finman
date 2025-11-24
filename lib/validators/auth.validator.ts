/**
 * Authentication Validation Schemas
 * Zod schemas for validating authentication-related requests
 */

import { z } from 'zod';

/**
 * User Registration Validation Schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character'
    ),
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code (e.g., USD, EUR)')
    .default('USD')
    .optional(),
  timezone: z.string().trim().default('UTC').optional(),
});

/**
 * User Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Change Password Validation Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character'
    ),
});

/**
 * Type inference for registration input
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Type inference for login input
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Type inference for change password input
 */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

