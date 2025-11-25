/**
 * Transaction Validation Schemas
 * Zod schemas for validating transaction-related requests
 */

import { z } from 'zod';

/**
 * Transaction Type Enum
 */
const transactionTypeEnum = z.enum(['income', 'expense']);

/**
 * Payment Method Enum
 */
const paymentMethodEnum = z.enum([
  'cash',
  'card',
  'bank_transfer',
  'digital_wallet',
  'other',
]);

/**
 * Recurring Frequency Enum
 */
const recurringFrequencyEnum = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

/**
 * Location Schema
 */
const locationSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
  address: z.string().trim().max(500, 'Address cannot exceed 500 characters').optional(),
});

/**
 * Recurring Pattern Schema
 */
const recurringPatternSchema = z.object({
  frequency: recurringFrequencyEnum,
  endDate: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  nextOccurrence: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
});

/**
 * Transaction Create Validation Schema
 */
export const createTransactionSchema = z.object({
  type: transactionTypeEnum,
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(999999999.99, 'Amount cannot exceed 999,999,999.99'),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be a 3-character ISO code (e.g., USD, EUR)')
    .toUpperCase(),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Category ID must be a valid MongoDB ObjectId'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  date: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
  paymentMethod: paymentMethodEnum.optional(),
  tags: z
    .array(z.string().trim().max(50, 'Tag cannot exceed 50 characters'))
    .max(20, 'Cannot have more than 20 tags')
    .optional(),
  location: locationSchema.optional(),
  receiptId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Receipt ID must be a valid MongoDB ObjectId')
    .optional(),
  isRecurring: z.boolean().optional(),
  recurringPattern: recurringPatternSchema.optional(),
});

/**
 * Transaction Update Validation Schema
 */
export const updateTransactionSchema = z.object({
  type: transactionTypeEnum.optional(),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(999999999.99, 'Amount cannot exceed 999,999,999.99')
    .optional(),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be a 3-character ISO code (e.g., USD, EUR)')
    .toUpperCase()
    .optional(),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Category ID must be a valid MongoDB ObjectId')
    .optional(),
  description: z
    .preprocess(
      (val) => (val === '' ? null : val),
      z
        .string()
        .trim()
        .max(1000, 'Description cannot exceed 1000 characters')
        .nullable()
        .optional()
    ),
  date: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  paymentMethod: z.preprocess(
    (val) => (val === '' ? null : val),
    paymentMethodEnum.nullable().optional()
  ),
  tags: z.preprocess(
    (val) => (val === null || (Array.isArray(val) && val.length === 0) ? null : val),
    z
      .array(z.string().trim().max(50, 'Tag cannot exceed 50 characters'))
      .max(20, 'Cannot have more than 20 tags')
      .nullable()
      .optional()
  ),
  location: z.preprocess(
    (val) => (val === null || (typeof val === 'object' && Object.keys(val).length === 0) ? null : val),
    locationSchema.nullable().optional()
  ),
  receiptId: z.preprocess(
    (val) => (val === '' ? null : val),
    z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Receipt ID must be a valid MongoDB ObjectId')
      .nullable()
      .optional()
  ),
  isRecurring: z.boolean().optional(),
  recurringPattern: z.preprocess(
    (val) => (val === null ? null : val),
    recurringPatternSchema.nullable().optional()
  ),
});

/**
 * Type inference for transaction create input
 */
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

/**
 * Type inference for transaction update input
 */
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

