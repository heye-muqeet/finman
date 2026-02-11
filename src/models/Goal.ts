/**
 * Goal Model
 * Mongoose schema and model for Financial Goal entity
 */

import { Schema, model, models, Document, Types } from 'mongoose';
import type { GoalCategory, GoalStatus } from '@/types/goal.types';

/**
 * Goal Schema
 */
const GoalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      minlength: [1, 'Goal title must be at least 1 character long'],
      maxlength: [100, 'Goal title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0.01, 'Target amount must be greater than 0'],
    },
    currentAmount: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
      uppercase: true,
      minlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
      maxlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
    },
    targetDate: {
      type: Date,
      required: false,
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ['savings', 'debt_payoff', 'investment', 'purchase', 'other'],
        message: 'Goal category must be one of: savings, debt_payoff, investment, purchase, other',
      },
      required: [true, 'Goal category is required'],
      default: 'savings',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'paused', 'cancelled'],
        message: 'Goal status must be one of: active, completed, paused, cancelled',
      },
      required: false,
      default: 'active',
    },
    isCompleted: {
      type: Boolean,
      default: false,
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
    collection: 'goals',
  }
);

/**
 * Indexes for efficient queries
 */
// Compound index for user goals by target date (most common query)
GoalSchema.index({ userId: 1, targetDate: -1 });

// Compound index for user goals by status
GoalSchema.index({ userId: 1, status: 1 });

// Compound index for user goals by category
GoalSchema.index({ userId: 1, category: 1 });

// Compound index for user goals by completion status
GoalSchema.index({ userId: 1, isCompleted: 1 });

// Index for sorting by creation date
GoalSchema.index({ userId: 1, createdAt: -1 });

// Compound index for active goals
GoalSchema.index({ userId: 1, status: 1, isCompleted: 1 });

/**
 * Goal Interface (Mongoose Document)
 */
export interface IGoal extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: Date | null;
  category: GoalCategory;
  status: GoalStatus;
  isCompleted: boolean;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  getProgressPercentage(): number;
  isOverdue(): boolean;
  getDaysRemaining(): number | null;
}

/**
 * Goal Model Interface (for static methods)
 */
export interface IGoalModel {
  findByUser(
    userId: string | Types.ObjectId,
    options?: {
      status?: GoalStatus;
      category?: GoalCategory;
      isCompleted?: boolean;
      targetDate?: Date;
    }
  ): Promise<IGoal[]>;
  findActiveGoals(userId: string | Types.ObjectId): Promise<IGoal[]>;
  findByCategory(
    userId: string | Types.ObjectId,
    category: GoalCategory
  ): Promise<IGoal[]>;
  findByStatus(
    userId: string | Types.ObjectId,
    status: GoalStatus
  ): Promise<IGoal[]>;
}

/**
 * Virtual: Get user (populate helper)
 */
GoalSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Ensure virtuals are included in JSON output
 */
GoalSchema.set('toJSON', { virtuals: true });
GoalSchema.set('toObject', { virtuals: true });

/**
 * Static Methods
 */

/**
 * Find goals by user with optional filters
 */
GoalSchema.statics.findByUser = async function (
  userId: string | Types.ObjectId,
  options?: {
    status?: GoalStatus;
    category?: GoalCategory;
    isCompleted?: boolean;
    targetDate?: Date;
  }
) {
  const query: any = { userId };
  
  if (options?.status !== undefined) {
    query.status = options.status;
  }
  
  if (options?.category !== undefined) {
    query.category = options.category;
  }
  
  if (options?.isCompleted !== undefined) {
    query.isCompleted = options.isCompleted;
  }
  
  if (options?.targetDate !== undefined) {
    // Find goals with target date on or before the specified date
    // Useful for finding overdue goals or goals due by a certain date
    query.targetDate = { $lte: options.targetDate };
  }
  
  return this.find(query).sort({ targetDate: -1, createdAt: -1 });
};

/**
 * Find active goals for a user
 */
GoalSchema.statics.findActiveGoals = async function (userId: string | Types.ObjectId) {
  return this.find({ userId, status: 'active', isCompleted: false }).sort({ targetDate: -1, createdAt: -1 });
};

/**
 * Find goals by category for a user
 */
GoalSchema.statics.findByCategory = async function (
  userId: string | Types.ObjectId,
  category: GoalCategory
) {
  return this.find({ userId, category }).sort({ targetDate: -1, createdAt: -1 });
};

/**
 * Find goals by status for a user
 */
GoalSchema.statics.findByStatus = async function (
  userId: string | Types.ObjectId,
  status: GoalStatus
) {
  return this.find({ userId, status }).sort({ targetDate: -1, createdAt: -1 });
};

/**
 * Instance Methods
 */

/**
 * Get progress percentage
 */
GoalSchema.methods.getProgressPercentage = function (): number {
  if (this.targetAmount <= 0) {
    return 0;
  }
  const percentage = (this.currentAmount / this.targetAmount) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
};

/**
 * Check if goal is overdue
 */
GoalSchema.methods.isOverdue = function (): boolean {
  if (!this.targetDate || this.isCompleted) {
    return false;
  }
  const now = new Date();
  return this.targetDate < now && this.currentAmount < this.targetAmount;
};

/**
 * Get days remaining until target date
 */
GoalSchema.methods.getDaysRemaining = function (): number | null {
  if (!this.targetDate) {
    return null;
  }
  const now = new Date();
  const diffTime = this.targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Pre-save middleware: Auto-update isCompleted and status based on currentAmount
 */
GoalSchema.pre('save', function (next) {
  // Auto-complete if currentAmount >= targetAmount
  if (this.currentAmount >= this.targetAmount && this.targetAmount > 0) {
    this.isCompleted = true;
    // Only change status to 'completed' if it's currently 'active'
    // Preserve 'paused' or 'cancelled' status
    if (this.status === 'active') {
      this.status = 'completed';
    }
  }
  // Auto-uncomplete if currentAmount < targetAmount
  else if (this.currentAmount < this.targetAmount && this.isCompleted) {
    this.isCompleted = false;
    // Only change status from 'completed' to 'active'
    // Preserve 'paused' or 'cancelled' status if they were set
    if (this.status === 'completed') {
      this.status = 'active';
    }
    // If status is 'paused' or 'cancelled', keep it as is
  }
  next();
});

/**
 * Export Goal Model
 */
export const Goal = models.Goal || model<IGoal, IGoalModel>('Goal', GoalSchema);

