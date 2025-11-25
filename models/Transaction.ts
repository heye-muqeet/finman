/**
 * Transaction Model
 * Mongoose schema and model for Transaction entity
 */

import { Schema, model, models, Document, Types } from 'mongoose';
import type {
  TransactionType,
  PaymentMethod,
  RecurringFrequency,
  TransactionLocation,
  RecurringPattern,
} from '@/types/transaction.types';

/**
 * Location Schema
 */
const LocationSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: false,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: false,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

/**
 * Recurring Pattern Schema
 */
const RecurringPatternSchema = new Schema(
  {
    frequency: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly', 'yearly'],
        message: 'Recurring frequency must be one of: daily, weekly, monthly, yearly',
      },
      required: [true, 'Recurring frequency is required'],
    },
    endDate: {
      type: Date,
      required: false,
    },
    nextOccurrence: {
      type: Date,
      required: false,
    },
  },
  { _id: false }
);

/**
 * Transaction Schema
 */
const TransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: 'Transaction type must be either income or expense',
      },
      required: [true, 'Transaction type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be greater than or equal to 0'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
      uppercase: true,
      minlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
      maxlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'],
        message:
          'Payment method must be one of: cash, card, bank_transfer, digital_wallet, other',
      },
      required: false,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10; // Limit to 10 tags
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    location: {
      type: LocationSchema,
      required: false,
    },
    receiptId: {
      type: Schema.Types.ObjectId,
      ref: 'Receipt',
      required: false,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: RecurringPatternSchema,
      required: function (this: ITransaction) {
        return this.isRecurring === true;
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'transactions',
  }
);

/**
 * Indexes for efficient queries
 */
// Compound index for user transactions by date (most common query)
TransactionSchema.index({ userId: 1, date: -1 });

// Compound index for user transactions by type and date
TransactionSchema.index({ userId: 1, type: 1, date: -1 });

// Compound index for user transactions by category and date
TransactionSchema.index({ userId: 1, categoryId: 1, date: -1 });

// Compound index for user transactions by amount
TransactionSchema.index({ userId: 1, amount: 1 });

// Compound index for user transactions by tags
TransactionSchema.index({ userId: 1, tags: 1 });

// Compound index for user transactions by payment method
TransactionSchema.index({ userId: 1, paymentMethod: 1 });

// Compound index for user transactions by date and amount (for reports)
TransactionSchema.index({ userId: 1, date: -1, amount: -1 });

// Text index for full-text search on description and tags
TransactionSchema.index(
  {
    description: 'text',
    tags: 'text',
  },
  {
    weights: {
      description: 10,
      tags: 5,
    },
    name: 'transaction_text_index',
  }
);

// Index for recurring transactions
TransactionSchema.index({ userId: 1, isRecurring: 1, 'recurringPattern.nextOccurrence': 1 });

// Index for receipt relationship
TransactionSchema.index({ receiptId: 1 });

/**
 * Transaction Interface (Mongoose Document)
 */
export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: Types.ObjectId;
  description?: string;
  date: Date;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  location?: TransactionLocation;
  receiptId?: Types.ObjectId;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  updatedAt: Date;
  isOverdue(): boolean;
}

/**
 * Transaction Model Interface (for static methods)
 */
export interface ITransactionModel {
  findByUser(
    userId: string | Types.ObjectId,
    options?: {
      type?: TransactionType;
      categoryId?: string | Types.ObjectId;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      skip?: number;
      sort?: { [key: string]: 1 | -1 };
    }
  ): Promise<ITransaction[]>;
  getUserStats(
    userId: string | Types.ObjectId,
    startDate?: Date,
    endDate?: Date
  ): Promise<any>;
}

/**
 * Virtual: Get category (populate helper)
 */
TransactionSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Virtual: Get user (populate helper)
 */
TransactionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Virtual: Get receipt (populate helper)
 */
TransactionSchema.virtual('receipt', {
  ref: 'Receipt',
  localField: 'receiptId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Ensure virtuals are included in JSON output
 */
TransactionSchema.set('toJSON', { virtuals: true });
TransactionSchema.set('toObject', { virtuals: true });

/**
 * Static method: Find transactions by user
 */
TransactionSchema.statics.findByUser = async function (
  userId: string | Types.ObjectId,
  options?: {
    type?: TransactionType;
    categoryId?: string | Types.ObjectId;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
    sort?: { [key: string]: 1 | -1 };
  }
) {
  const query: any = { userId };
  
  if (options?.type) {
    query.type = options.type;
  }
  
  if (options?.categoryId) {
    query.categoryId = options.categoryId;
  }
  
  if (options?.startDate || options?.endDate) {
    query.date = {};
    if (options.startDate) {
      query.date.$gte = options.startDate;
    }
    if (options.endDate) {
      query.date.$lte = options.endDate;
    }
  }
  
  let queryBuilder = this.find(query);
  
  if (options?.sort) {
    queryBuilder = queryBuilder.sort(options.sort);
  } else {
    queryBuilder = queryBuilder.sort({ date: -1 }); // Default sort by date descending
  }
  
  if (options?.skip) {
    queryBuilder = queryBuilder.skip(options.skip);
  }
  
  if (options?.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  return queryBuilder;
};

/**
 * Static method: Get transaction statistics for user
 */
TransactionSchema.statics.getUserStats = async function (
  userId: string | Types.ObjectId,
  startDate?: Date,
  endDate?: Date
) {
  const matchQuery: any = { userId };
  
  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) {
      matchQuery.date.$gte = startDate;
    }
    if (endDate) {
      matchQuery.date.$lte = endDate;
    }
  }
  
  const stats = await this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        average: { $avg: '$amount' },
        min: { $min: '$amount' },
        max: { $max: '$amount' },
      },
    },
  ]);
  
  const result: any = {
    income: { total: 0, count: 0, average: 0, min: 0, max: 0 },
    expense: { total: 0, count: 0, average: 0, min: 0, max: 0 },
  };
  
  stats.forEach((stat) => {
    result[stat._id] = {
      total: stat.total,
      count: stat.count,
      average: stat.average,
      min: stat.min,
      max: stat.max,
    };
  });
  
  result.net = result.income.total - result.expense.total;
  result.totalTransactions = result.income.count + result.expense.count;
  
  return result;
};

/**
 * Instance method: Check if transaction is overdue (for recurring)
 */
TransactionSchema.methods.isOverdue = function () {
  if (!this.isRecurring || !this.recurringPattern?.nextOccurrence) {
    return false;
  }
  return new Date() > this.recurringPattern.nextOccurrence;
};

// Export Transaction model (use existing model if available, otherwise create new one)
export const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

