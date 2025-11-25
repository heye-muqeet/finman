/**
 * Category Validation Schemas
 * Zod schemas for validating category-related requests
 */

import { z } from 'zod';

/**
 * Category Type Enum
 */
const categoryTypeEnum = z.enum(['income', 'expense', 'both']);

/**
 * Category Create Validation Schema
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(100, 'Category name cannot exceed 100 characters'),
  type: categoryTypeEnum,
  icon: z
    .union([
      z.string().trim().max(50, 'Icon identifier cannot exceed 50 characters'),
      z.undefined(),
    ])
    .refine((val) => val !== '', 'Icon cannot be an empty string')
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
  parentCategoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Parent category ID must be a valid MongoDB ObjectId')
    .optional(),
  isDefault: z.boolean().optional(),
});

/**
 * Category Update Validation Schema
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(100, 'Category name cannot exceed 100 characters')
    .optional(),
  type: categoryTypeEnum.optional(),
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
  parentCategoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Parent category ID must be a valid MongoDB ObjectId')
    .optional()
    .nullable(),
  isDefault: z.boolean().optional(),
});

/**
 * Type inference for category create input
 */
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * Type inference for category update input
 */
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

