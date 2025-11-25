/**
 * Transaction Service
 * Handles transaction CRUD operations and business logic
 */

import { Types } from 'mongoose';
import { Transaction as TransactionModel, ITransaction, ITransactionModel } from '@/models/Transaction';
import { Category } from '@/models/Category';
import { connectDB } from '@/lib/database/connection';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/utils/error-handler';
import { loggerService } from '@/lib/services/logger.service';
import type {
  TransactionCreateInput,
  TransactionUpdateInput,
  TransactionResponse,
  TransactionsListResponse,
  TransactionFilters,
  TransactionQueryOptions,
  Transaction as TransactionDTO,
} from '@/types/transaction.types';

/**
 * Convert Mongoose document to plain Transaction object
 */
function toTransactionObject(transaction: ITransaction): TransactionDTO {
  return {
    _id: transaction._id.toString(),
    userId: transaction.userId.toString(),
    type: transaction.type,
    amount: transaction.amount,
    currency: transaction.currency,
    categoryId: transaction.categoryId.toString(),
    description: transaction.description,
    date: transaction.date,
    paymentMethod: transaction.paymentMethod,
    tags: transaction.tags,
    location: transaction.location,
    receiptId: transaction.receiptId?.toString(),
    isRecurring: transaction.isRecurring || false,
    recurringPattern: transaction.recurringPattern,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
}

/**
 * Create a new transaction
 * @param userId - User ID
 * @param input - Transaction creation data
 * @returns Created transaction
 */
export async function createTransaction(
  userId: string,
  input: TransactionCreateInput
): Promise<TransactionResponse> {
  await connectDB();

  try {
    // Validate category exists and belongs to user
    const category = await Category.findById(input.categoryId);
    if (!category) {
      throw new ValidationError('Category does not exist');
    }
    if (category.userId.toString() !== userId) {
      throw new ForbiddenError('Category does not belong to this user');
    }

    // Validate category type matches transaction type
    if (category.type !== 'both' && category.type !== input.type) {
      throw new ValidationError(
        `Category type "${category.type}" does not match transaction type "${input.type}"`
      );
    }

    // Validate recurring pattern if isRecurring is true
    if (input.isRecurring && !input.recurringPattern) {
      throw new ValidationError('Recurring pattern is required when isRecurring is true');
    }

    // Validate recurring pattern structure if provided
    if (input.recurringPattern) {
      validateRecurringPattern(input.recurringPattern);
    }

    // Create transaction
    const transaction = new TransactionModel({
      userId: new Types.ObjectId(userId),
      type: input.type,
      amount: input.amount,
      currency: input.currency.toUpperCase().trim(),
      categoryId: new Types.ObjectId(input.categoryId),
      description: input.description?.trim(),
      date: input.date,
      paymentMethod: input.paymentMethod,
      tags: input.tags || [],
      location: input.location,
      receiptId: input.receiptId ? new Types.ObjectId(input.receiptId) : undefined,
      isRecurring: input.isRecurring || false,
      recurringPattern: input.recurringPattern,
    });

    await transaction.save();

    loggerService.logDatabase('CREATE', 'transactions', {
      userId,
      transactionId: transaction._id.toString(),
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
    });
    loggerService.logUserAction('create_transaction', userId, {
      transactionId: transaction._id.toString(),
      type: transaction.type,
      amount: transaction.amount,
    });

    // Emit WebSocket event (prepared for Chunk 73/74)
    emitWebSocketEvent('transaction:created', userId, {
      transaction: toTransactionObject(transaction),
    });

    return {
      transaction: toTransactionObject(transaction),
      message: 'Transaction created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to create transaction', error, { userId });
    throw new ValidationError('Failed to create transaction');
  }
}

/**
 * Get transactions for a user with filtering, pagination, and sorting
 * @param userId - User ID
 * @param options - Query options (filters, pagination, sorting)
 * @returns List of transactions
 */
export async function getTransactions(
  userId: string,
  options: TransactionQueryOptions = {}
): Promise<TransactionsListResponse> {
  await connectDB();

  try {
    const {
      filters = {},
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
    } = options;

    // Build query
    const query: any = { userId: new Types.ObjectId(userId) };

    // Apply filters
    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.categoryId) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined) {
        query.amount.$gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        query.amount.$lte = filters.maxAmount;
      }
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Text search on description and tags
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [transactions, total] = await Promise.all([
      TransactionModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      TransactionModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    loggerService.logDatabase('FIND', 'transactions', {
      userId,
      filters,
      page,
      limit,
      count: transactions.length,
      total,
    });

    return {
      transactions: transactions.map((t) => toTransactionObject(t)),
      total,
      page,
      limit,
      totalPages,
      message: 'Transactions retrieved successfully',
    };
  } catch (error) {
    loggerService.error('Failed to get transactions', error, { userId, options });
    throw new ValidationError('Failed to retrieve transactions');
  }
}

/**
 * Get transaction by ID
 * @param userId - User ID
 * @param transactionId - Transaction ID
 * @returns Transaction
 */
export async function getTransactionById(
  userId: string,
  transactionId: string
): Promise<TransactionResponse> {
  await connectDB();

  try {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError('Transaction', transactionId);
    }

    // Ensure transaction belongs to the user
    if (transaction.userId.toString() !== userId) {
      throw new ForbiddenError('Transaction does not belong to this user');
    }

    loggerService.logDatabase('FIND', 'transactions', {
      userId,
      transactionId: transaction._id.toString(),
    });

    return {
      transaction: toTransactionObject(transaction),
      message: 'Transaction retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to get transaction', error, { userId, transactionId });
    throw new ValidationError('Failed to retrieve transaction');
  }
}

/**
 * Update transaction
 * @param userId - User ID
 * @param transactionId - Transaction ID
 * @param input - Transaction update data
 * @returns Updated transaction
 */
export async function updateTransaction(
  userId: string,
  transactionId: string,
  input: TransactionUpdateInput
): Promise<TransactionResponse> {
  await connectDB();

  try {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError('Transaction', transactionId);
    }

    // Ensure transaction belongs to the user
    if (transaction.userId.toString() !== userId) {
      throw new ForbiddenError('Transaction does not belong to this user');
    }

    // Validate category if being updated
    if (input.categoryId) {
      const category = await Category.findById(input.categoryId);
      if (!category) {
        throw new ValidationError('Category does not exist');
      }
      if (category.userId.toString() !== userId) {
        throw new ForbiddenError('Category does not belong to this user');
      }

      // Validate category type matches transaction type
      const transactionType = input.type || transaction.type;
      if (category.type !== 'both' && category.type !== transactionType) {
        throw new ValidationError(
          `Category type "${category.type}" does not match transaction type "${transactionType}"`
        );
      }
    }

    // Validate recurring pattern if isRecurring is being set to true
    if (input.isRecurring === true && !input.recurringPattern && !transaction.recurringPattern) {
      throw new ValidationError('Recurring pattern is required when isRecurring is true');
    }

    // Validate recurring pattern structure if provided
    if (input.recurringPattern) {
      validateRecurringPattern(input.recurringPattern);
    }

    // Update transaction fields
    if (input.type !== undefined) {
      transaction.type = input.type;
    }
    if (input.amount !== undefined) {
      transaction.amount = input.amount;
    }
    if (input.currency !== undefined) {
      transaction.currency = input.currency.toUpperCase().trim();
    }
    if (input.categoryId !== undefined) {
      transaction.categoryId = new Types.ObjectId(input.categoryId);
    }
    if (input.description !== undefined) {
      transaction.description = input.description?.trim();
    }
    if (input.date !== undefined) {
      transaction.date = input.date;
    }
    if (input.paymentMethod !== undefined) {
      transaction.paymentMethod = input.paymentMethod;
    }
    if (input.tags !== undefined) {
      transaction.tags = input.tags;
    }
    if (input.location !== undefined) {
      transaction.location = input.location;
    }
    if (input.receiptId !== undefined) {
      transaction.receiptId = input.receiptId ? new Types.ObjectId(input.receiptId) : undefined;
    }
    if (input.isRecurring !== undefined) {
      transaction.isRecurring = input.isRecurring;
    }
    if (input.recurringPattern !== undefined) {
      transaction.recurringPattern = input.recurringPattern;
    }

    await transaction.save();

    loggerService.logDatabase('UPDATE', 'transactions', {
      userId,
      transactionId: transaction._id.toString(),
    });
    loggerService.logUserAction('update_transaction', userId, {
      transactionId: transaction._id.toString(),
      fields: Object.keys(input),
    });

    // Emit WebSocket event (prepared for Chunk 73/74)
    emitWebSocketEvent('transaction:updated', userId, {
      transaction: toTransactionObject(transaction),
    });

    return {
      transaction: toTransactionObject(transaction),
      message: 'Transaction updated successfully',
    };
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to update transaction', error, { userId, transactionId });
    throw new ValidationError('Failed to update transaction');
  }
}

/**
 * Delete transaction
 * @param userId - User ID
 * @param transactionId - Transaction ID
 */
export async function deleteTransaction(userId: string, transactionId: string): Promise<void> {
  await connectDB();

  try {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError('Transaction', transactionId);
    }

    // Ensure transaction belongs to the user
    if (transaction.userId.toString() !== userId) {
      throw new ForbiddenError('Transaction does not belong to this user');
    }

    await TransactionModel.findByIdAndDelete(transactionId);

    loggerService.logDatabase('DELETE', 'transactions', {
      userId,
      transactionId,
      type: transaction.type,
      amount: transaction.amount,
    });
    loggerService.logUserAction('delete_transaction', userId, {
      transactionId,
      type: transaction.type,
      amount: transaction.amount,
    });

    // Emit WebSocket event (prepared for Chunk 73/74)
    emitWebSocketEvent('transaction:deleted', userId, {
      transactionId,
      type: transaction.type,
      amount: transaction.amount,
    });
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to delete transaction', error, { userId, transactionId });
    throw new ValidationError('Failed to delete transaction');
  }
}

/**
 * Get transaction statistics for a user
 * @param userId - User ID
 * @param startDate - Optional start date for filtering
 * @param endDate - Optional end date for filtering
 * @returns Transaction statistics (income, expense, totals, counts, averages, min, max, net)
 */
export async function getUserStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<any> {
  await connectDB();

  try {
    const stats = await (TransactionModel as unknown as ITransactionModel).getUserStats(
      userId,
      startDate,
      endDate
    );

    loggerService.logDatabase('AGGREGATE', 'transactions', {
      userId,
      startDate,
      endDate,
      operation: 'getUserStats',
    });

    return stats;
  } catch (error) {
    loggerService.error('Failed to get user transaction stats', error, {
      userId,
      startDate,
      endDate,
    });
    throw new ValidationError('Failed to retrieve transaction statistics');
  }
}

/**
 * Calculate next occurrence date for recurring transaction
 * @param currentDate - Current date
 * @param frequency - Recurring frequency (daily, weekly, monthly, yearly)
 * @returns Next occurrence date
 */
export function calculateNextDate(
  currentDate: Date,
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Date {
  const next = new Date(currentDate);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      throw new ValidationError(`Invalid frequency: ${frequency}`);
  }
  return next;
}

/**
 * Validate recurring pattern
 * @param pattern - Recurring pattern to validate
 * @returns True if valid, throws ValidationError if invalid
 */
export function validateRecurringPattern(pattern: {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  endDate?: Date;
  nextOccurrence?: Date;
}): boolean {
  if (!pattern.frequency) {
    throw new ValidationError('Recurring frequency is required');
  }

  const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
  if (!validFrequencies.includes(pattern.frequency)) {
    throw new ValidationError(
      `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`
    );
  }

  if (pattern.endDate && pattern.nextOccurrence) {
    if (pattern.endDate < pattern.nextOccurrence) {
      throw new ValidationError(
        'End date must be after or equal to next occurrence date'
      );
    }
  }

  return true;
}

/**
 * Emit WebSocket event for transaction (prepared for Chunk 73/74)
 * @param event - Event name
 * @param userId - User ID
 * @param data - Event data
 */
function emitWebSocketEvent(
  event: string,
  userId: string,
  data: any
): void {
  // WebSocket service will be available in Chunk 73
  // This is a placeholder that will be activated when WebSocket service is ready
  if (typeof global !== 'undefined' && (global as any).wsService) {
    try {
      (global as any).wsService.emit(`user:${userId}`, event, data);
    } catch (error) {
      // Silently fail if WebSocket service is not available
      loggerService.error('Failed to emit WebSocket event', error, {
        event,
        userId,
      });
    }
  }
}

