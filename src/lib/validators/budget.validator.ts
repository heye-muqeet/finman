/**
 * Budget Validation Schemas
 * Zod schemas for validating budget-related requests
 */

import { z } from 'zod';

/**
 * Budget Period Enum
 */
const budgetPeriodEnum = z.enum(['weekly', 'monthly', 'yearly']);

/**
 * Budget Create Validation Schema
 */
export const createBudgetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Budget name is required')
    .max(100, 'Budget name cannot exceed 100 characters'),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Category ID must be a valid MongoDB ObjectId')
    .optional(),
  amount: z
    .number()
    .positive('Budget amount must be greater than 0')
    .min(0.01, 'Budget amount must be at least 0.01'),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency code must be 3 characters (ISO 4217)')
    .toUpperCase(),
  period: budgetPeriodEnum,
  startDate: z.coerce.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date',
  }),
  endDate: z.coerce
    .date({
      invalid_type_error: 'End date must be a valid date',
    })
    .optional(),
  alertThreshold: z
    .number()
    .min(0, 'Alert threshold must be between 0 and 100')
    .max(100, 'Alert threshold must be between 0 and 100')
    .optional(),
  isActive: z.boolean().optional(),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
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
    .union([
      z.string().trim().max(50, 'Icon identifier cannot exceed 50 characters'),
      z.undefined(),
    ])
    .refine((val) => val !== '', 'Icon cannot be an empty string')
    .optional(),
}).refine(
  (data) => {
    // If endDate is provided, it must be after startDate
    if (data.endDate && data.startDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Budget Update Validation Schema
 */
export const updateBudgetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Budget name is required')
    .max(100, 'Budget name cannot exceed 100 characters')
    .optional(),
  categoryId: z
    .union([
      z.string().regex(/^[0-9a-fA-F]{24}$/, 'Category ID must be a valid MongoDB ObjectId'),
      z.null(),
    ])
    .optional(),
  amount: z
    .number()
    .positive('Budget amount must be greater than 0')
    .min(0.01, 'Budget amount must be at least 0.01')
    .optional(),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency code must be 3 characters (ISO 4217)')
    .toUpperCase()
    .optional(),
  period: budgetPeriodEnum.optional(),
  startDate: z.coerce
    .date({
      invalid_type_error: 'Start date must be a valid date',
    })
    .optional(),
  endDate: z
    .union([
      z.coerce.date({
        invalid_type_error: 'End date must be a valid date',
      }),
      z.null(),
    ])
    .optional(),
  alertThreshold: z
    .union([
      z
        .number()
        .min(0, 'Alert threshold must be between 0 and 100')
        .max(100, 'Alert threshold must be between 0 and 100'),
      z.null(),
    ])
    .optional(),
  isActive: z.boolean().optional(),
  description: z
    .union([
      z.string().trim().max(500, 'Description cannot exceed 500 characters'),
      z.null(),
    ])
    .optional(),
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
    (val) => {
      // Convert empty strings to null (to clear the field)
      // Preserve null and undefined as-is
      if (val === '') return null;
      return val;
    },
    z
      .union([
        z.string().trim().max(50, 'Icon identifier cannot exceed 50 characters'),
        z.null(),
        z.undefined(),
      ])
      .optional()
      .nullable()
  ),
}).refine(
  (data) => {
    // If both startDate and endDate are provided, endDate must be after startDate
    if (data.endDate && data.startDate && data.endDate !== null) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Type inference for budget create input
 */
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

/**
 * Type inference for budget update input
 */
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

