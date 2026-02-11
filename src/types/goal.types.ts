/**
 * Goal TypeScript Types
 * Type definitions for Financial Goal entity
 */

/**
 * Goal Category Enum
 */
export type GoalCategory = 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'other';

/**
 * Goal Status Enum
 */
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

/**
 * Goal Interface (Mongoose Document)
 */
export interface IGoal {
  userId: string; // ObjectId reference to User
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: Date;
  category: GoalCategory;
  status: GoalStatus;
  isCompleted: boolean;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Goal Type (for API responses and client-side usage)
 */
export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: Date;
  category: GoalCategory;
  status: GoalStatus;
  isCompleted: boolean;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Goal Create Input Type
 */
export interface GoalCreateInput {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  currency: string;
  targetDate?: Date;
  category: GoalCategory;
  status?: GoalStatus;
  isCompleted?: boolean;
  color?: string;
  icon?: string;
}

/**
 * Goal Update Input Type
 */
export interface GoalUpdateInput {
  title?: string;
  description?: string | null;
  targetAmount?: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: Date | null;
  category?: GoalCategory;
  status?: GoalStatus;
  isCompleted?: boolean;
  color?: string | null;
  icon?: string | null;
}

/**
 * Goal Progress Interface
 */
export interface GoalProgress {
  currentAmount: number;
  targetAmount: number;
  remaining: number;
  percentageComplete: number;
  isCompleted: boolean;
  isOverdue: boolean;
  daysRemaining: number | null;
  daysElapsed: number;
  estimatedCompletionDate: Date | null;
}

/**
 * Goal Progress Response Type
 */
export interface GoalProgressResponse {
  goal: Goal;
  progress: GoalProgress;
  message?: string;
}

/**
 * Goal Response Type
 */
export interface GoalResponse {
  goal: Goal;
  message?: string;
}

/**
 * Goals List Response Type
 */
export interface GoalsListResponse {
  goals: Goal[];
  total: number;
  message?: string;
}

