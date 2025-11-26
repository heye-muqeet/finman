/**
 * Budget TypeScript Types
 * Type definitions for Budget entity
 */

/**
 * Budget Period Enum
 */
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

/**
 * Budget Interface (Mongoose Document)
 */
export interface IBudget {
  userId: string; // ObjectId reference to User
  name: string;
  categoryId?: string; // ObjectId reference to Category (optional for general budgets)
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  alertThreshold?: number; // Percentage (0-100)
  isActive?: boolean;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Budget Type (for API responses and client-side usage)
 */
export interface Budget {
  _id: string;
  userId: string;
  name: string;
  categoryId?: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  alertThreshold?: number;
  isActive?: boolean;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Budget Create Input Type
 */
export interface BudgetCreateInput {
  name: string;
  categoryId?: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  alertThreshold?: number;
  isActive?: boolean;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * Budget Update Input Type
 */
export interface BudgetUpdateInput {
  name?: string;
  categoryId?: string | null;
  amount?: number;
  currency?: string;
  period?: BudgetPeriod;
  startDate?: Date;
  endDate?: Date | null;
  alertThreshold?: number | null;
  isActive?: boolean;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
}

/**
 * Budget Response Type
 */
export interface BudgetResponse {
  budget: Budget;
  message?: string;
}

/**
 * Budgets List Response Type
 */
export interface BudgetsListResponse {
  budgets: Budget[];
  total: number;
  message?: string;
}

/**
 * Budget Progress Interface
 * (Defined in budgets.service.ts, exported here for type consistency)
 */
export interface BudgetProgress {
  spent: number;
  remaining: number;
  percentageUsed: number;
  isExceeded: boolean;
  alertTriggered: boolean;
  alertType: 'threshold' | 'exceeded' | null;
  alertMessage: string | null;
  transactionCount: number;
  startDate: Date;
  endDate: Date | null;
  periodDays: number;
  daysRemaining: number | null;
}

/**
 * Budget Progress Response Type
 */
export interface BudgetProgressResponse {
  budget: Budget;
  progress: BudgetProgress;
  message?: string;
}

