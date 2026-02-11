/**
 * Goal Validation Schemas
 * Zod schemas for validating goal-related requests
 */

import { z } from 'zod';

/**
 * Goal Category Enum
 */
const goalCategoryEnum = z.enum(['savings', 'debt_payoff', 'investment', 'purchase', 'other']);

/**
 * Goal Status Enum
 */
const goalStatusEnum = z.enum(['active', 'completed', 'paused', 'cancelled']);

/**
 * Goal Create Validation Schema
 */
export const createGoalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Goal title is required')
    .max(100, 'Goal title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  targetAmount: z
    .number()
    .positive('Target amount must be greater than 0')
    .min(0.01, 'Target amount must be at least 0.01'),
  currentAmount: z
    .number()
    .nonnegative('Current amount cannot be negative')
    .optional(),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency code must be 3 characters (ISO 4217)')
    .toUpperCase(),
  targetDate: z.coerce
    .date({
      invalid_type_error: 'Target date must be a valid date',
    })
    .optional(),
  category: goalCategoryEnum,
  status: goalStatusEnum.optional(),
  isCompleted: z.boolean().optional(),
  color: z
    .union([
      z
        .string()
        .trim()
        .refine(
          (val) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val),
          'Color must be a valid hex color code (e.g., #FF5733 or #F73)'
        ),
      z.undefined(),
    ])
    .refine((val) => val !== '', 'Color cannot be an empty string')
    .optional(),
  icon: z
    .string()
    .trim()
    .max(50, 'Icon name cannot exceed 50 characters')
    .optional(),
});

/**
 * Goal Update Validation Schema
 * Allows partial updates and null values to clear optional fields
 */
export const updateGoalSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Goal title is required')
      .max(100, 'Goal title cannot exceed 100 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .nullable()
      .optional(),
    targetAmount: z
      .number()
      .positive('Target amount must be greater than 0')
      .min(0.01, 'Target amount must be at least 0.01')
      .optional(),
    currentAmount: z
      .number()
      .nonnegative('Current amount cannot be negative')
      .optional(),
    currency: z
      .string()
      .trim()
      .length(3, 'Currency code must be 3 characters (ISO 4217)')
      .toUpperCase()
      .optional(),
    targetDate: z.coerce
      .date({
        invalid_type_error: 'Target date must be a valid date',
      })
      .nullable()
      .optional(),
    category: goalCategoryEnum.optional(),
    status: goalStatusEnum.optional(),
    isCompleted: z.boolean().optional(),
    color: z
      .union([
        z
          .string()
          .trim()
          .refine(
            (val) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val),
            'Color must be a valid hex color code (e.g., #FF5733 or #F73)'
          ),
        z.null(),
        z.undefined(),
      ])
      .optional()
      .nullable(),
    icon: z
      .string()
      .trim()
      .max(50, 'Icon name cannot exceed 50 characters')
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

/**
 * Preprocess update schema to convert empty strings to null for nullable fields
 */
export const updateGoalSchemaWithPreprocess = updateGoalSchema
  .extend({
    description: z.preprocess(
      (val) => (val === '' ? null : val),
      z
        .string()
        .trim()
        .max(500, 'Description cannot exceed 500 characters')
        .nullable()
        .optional()
    ),
    targetDate: z.preprocess(
      (val) => (val === '' ? null : val),
      z.coerce
        .date({
          invalid_type_error: 'Target date must be a valid date',
        })
        .nullable()
        .optional()
    ),
    color: z.preprocess(
      (val) => {
        // Convert empty strings to null (to clear the field)
        // Preserve null and undefined as-is
        if (val === '') return null;
        return val;
      },
      z
        .union([
          z
            .string()
            .trim()
            .refine(
              (val) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val),
              'Color must be a valid hex color code (e.g., #FF5733 or #F73)'
            ),
          z.null(),
          z.undefined(),
        ])
        .optional()
        .nullable()
    ),
    icon: z.preprocess(
      (val) => (val === '' ? null : val),
      z
        .string()
        .trim()
        .max(50, 'Icon name cannot exceed 50 characters')
        .nullable()
        .optional()
    ),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

/**
 * Type exports for TypeScript
 */
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchemaWithPreprocess>;

