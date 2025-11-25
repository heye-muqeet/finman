/**
 * Transaction TypeScript Types
 * Type definitions for Transaction entity
 */

/**
 * Transaction Type Enum
 */
export type TransactionType = 'income' | 'expense';

/**
 * Payment Method Enum
 */
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other';

/**
 * Recurring Frequency Enum
 */
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Transaction Location Interface
 */
export interface TransactionLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

/**
 * Recurring Pattern Interface
 */
export interface RecurringPattern {
  frequency: RecurringFrequency;
  endDate?: Date;
  nextOccurrence?: Date;
}

/**
 * Transaction Interface (Mongoose Document)
 */
export interface ITransaction {
  userId: string; // ObjectId reference to User
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: string; // ObjectId reference to Category
  description?: string;
  date: Date;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  location?: TransactionLocation;
  receiptId?: string; // ObjectId reference to Receipt (optional)
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction Type (for API responses and client-side usage)
 */
export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: string;
  description?: string;
  date: Date;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  location?: TransactionLocation;
  receiptId?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction Create Input Type
 */
export interface TransactionCreateInput {
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: string;
  description?: string;
  date: Date;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  location?: TransactionLocation;
  receiptId?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

/**
 * Transaction Update Input Type
 */
export interface TransactionUpdateInput {
  type?: TransactionType;
  amount?: number;
  currency?: string;
  categoryId?: string;
  description?: string | null;
  date?: Date;
  paymentMethod?: PaymentMethod | null;
  tags?: string[] | null;
  location?: TransactionLocation | null;
  receiptId?: string | null;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern | null;
}

/**
 * Transaction Response Type
 */
export interface TransactionResponse {
  transaction: Transaction;
  message?: string;
}

/**
 * Transactions List Response Type
 */
export interface TransactionsListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
}

/**
 * Transaction Filter Options
 */
export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  search?: string; // For text search on description and tags
}

/**
 * Transaction Query Options
 */
export interface TransactionQueryOptions {
  filters?: TransactionFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

