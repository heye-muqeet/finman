/**
 * User Validation Schemas
 * Zod schemas for validating user profile-related requests
 */

import { z } from 'zod';

/**
 * User Profile Update Validation Schema
 * Note: Password updates are handled separately via change-password endpoint
 * 
 * Field clearing: firstName and lastName can be set to null or empty string to clear the field
 */
export const updateProfileSchema = z.object({
  firstName: z
    .union([
      z.string().trim().min(1, 'First name must be at least 1 character if provided'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)), // Transform empty string to null
  lastName: z
    .union([
      z.string().trim().min(1, 'Last name must be at least 1 character if provided'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)), // Transform empty string to null
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code (e.g., USD, EUR)')
    .optional(),
  timezone: z.string().trim().min(1, 'Timezone cannot be empty if provided').optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      notifications: z.boolean().optional(),
      language: z.string().min(2, 'Language must be at least 2 characters').optional(),
      currency: z
        .string()
        .length(3, 'Currency must be a 3-letter code (e.g., USD, EUR)')
        .optional(),
      timezone: z.string().trim().min(1, 'Timezone cannot be empty if provided').optional(),
      dateFormat: z.string().trim().min(1, 'Date format cannot be empty if provided').optional(),
      timeFormat: z.enum(['12h', '24h']).optional(),
    })
    .optional(),
});

/**
 * Type inference for update profile input
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

