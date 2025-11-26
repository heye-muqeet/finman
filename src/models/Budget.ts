/**
 * Budget Model
 * Mongoose schema and model for Budget entity
 */

import { Schema, model, models, Document, Types } from 'mongoose';
import type { BudgetPeriod } from '@/types/budget.types';

/**
 * Budget Schema
 */
const BudgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Budget name is required'],
      trim: true,
      minlength: [1, 'Budget name must be at least 1 character long'],
      maxlength: [100, 'Budget name cannot exceed 100 characters'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
      default: null,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0.01, 'Budget amount must be greater than 0'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
      uppercase: true,
      minlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
      maxlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
    },
    period: {
      type: String,
      enum: {
        values: ['weekly', 'monthly', 'yearly'],
        message: 'Budget period must be one of: weekly, monthly, yearly',
      },
      required: [true, 'Budget period is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: false,
      default: null,
      validate: {
        validator: function (this: IBudget, value: Date | null) {
          // If endDate is provided, it must be after startDate
          if (value && this.startDate) {
            return value > this.startDate;
          }
          return true;
        },
        message: 'End date must be after start date',
      },
    },
    alertThreshold: {
      type: Number,
      required: false,
      default: null,
      min: [0, 'Alert threshold must be between 0 and 100'],
      max: [100, 'Alert threshold must be between 0 and 100'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    color: {
      type: String,
      trim: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color code'],
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [50, 'Icon identifier cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'budgets',
  }
);

/**
 * Indexes for efficient queries
 */
// Compound index for user active budgets (most common query)
BudgetSchema.index({ userId: 1, isActive: 1 });

// Compound index for user budgets by period and start date
BudgetSchema.index({ userId: 1, period: 1, startDate: -1 });

// Index for category-based budgets
BudgetSchema.index({ categoryId: 1 });

// Compound index for date range queries
BudgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });

// Index for sorting by creation date
BudgetSchema.index({ userId: 1, createdAt: -1 });

// Compound index for active budgets with category
BudgetSchema.index({ userId: 1, isActive: 1, categoryId: 1 });

/**
 * Budget Interface (Mongoose Document)
 */
export interface IBudget extends Document {
  userId: Types.ObjectId;
  name: string;
  categoryId?: Types.ObjectId | null;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date | null;
  alertThreshold?: number | null;
  isActive?: boolean;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  isCurrentlyActive(): boolean;
  getDaysRemaining(): number | null;
}

/**
 * Budget Model Interface (for static methods)
 */
export interface IBudgetModel {
  findByUser(
    userId: string | Types.ObjectId,
    options?: {
      isActive?: boolean;
      period?: BudgetPeriod;
      categoryId?: string | Types.ObjectId;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<IBudget[]>;
  findActiveBudgets(userId: string | Types.ObjectId): Promise<IBudget[]>;
  findByCategory(
    userId: string | Types.ObjectId,
    categoryId: string | Types.ObjectId
  ): Promise<IBudget[]>;
  findByPeriod(
    userId: string | Types.ObjectId,
    period: BudgetPeriod
  ): Promise<IBudget[]>;
}

/**
 * Virtual: Get category (populate helper)
 */
BudgetSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Virtual: Get user (populate helper)
 */
BudgetSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Ensure virtuals are included in JSON output
 */
BudgetSchema.set('toJSON', { virtuals: true });
BudgetSchema.set('toObject', { virtuals: true });

/**
 * Static method: Find budgets by user
 */
BudgetSchema.statics.findByUser = async function (
  userId: string | Types.ObjectId,
  options?: {
    isActive?: boolean;
    period?: BudgetPeriod;
    categoryId?: string | Types.ObjectId;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const query: any = { userId };
  
  if (options?.isActive !== undefined) {
    query.isActive = options.isActive;
  }
  
  if (options?.period) {
    query.period = options.period;
  }
  
  if (options?.categoryId) {
    query.categoryId = options.categoryId;
  }
  
  if (options?.startDate || options?.endDate) {
    query.$or = [];
    if (options.startDate) {
      query.$or.push({ startDate: { $gte: options.startDate } });
    }
    if (options.endDate) {
      query.$or.push({ endDate: { $lte: options.endDate } });
      query.$or.push({ endDate: null });
    }
  }
  
  return this.find(query).sort({ startDate: -1 });
};

/**
 * Static method: Find active budgets
 */
BudgetSchema.statics.findActiveBudgets = async function (userId: string | Types.ObjectId) {
  return this.find({ userId, isActive: true }).sort({ startDate: -1 });
};

/**
 * Static method: Find budgets by category
 */
BudgetSchema.statics.findByCategory = async function (
  userId: string | Types.ObjectId,
  categoryId: string | Types.ObjectId
) {
  return this.find({ userId, categoryId }).sort({ startDate: -1 });
};

/**
 * Static method: Find budgets by period
 */
BudgetSchema.statics.findByPeriod = async function (
  userId: string | Types.ObjectId,
  period: BudgetPeriod
) {
  return this.find({ userId, period, isActive: true }).sort({ startDate: -1 });
};

/**
 * Instance method: Check if budget is currently active (within date range)
 */
BudgetSchema.methods.isCurrentlyActive = function () {
  if (!this.isActive) {
    return false;
  }
  
  const now = new Date();
  if (this.startDate > now) {
    return false; // Budget hasn't started yet
  }
  
  if (this.endDate && this.endDate < now) {
    return false; // Budget has ended
  }
  
  return true;
};

/**
 * Instance method: Get days remaining (if endDate is set)
 */
BudgetSchema.methods.getDaysRemaining = function () {
  if (!this.endDate) {
    return null; // No end date set
  }
  
  const now = new Date();
  const diffTime = this.endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// Export Budget model (use existing model if available, otherwise create new one)
export const Budget = models.Budget || model<IBudget>('Budget', BudgetSchema);

