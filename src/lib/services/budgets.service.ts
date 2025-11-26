/**
 * Budget Service
 * Handles budget CRUD operations, progress calculation, and alerts
 */

import { Types } from 'mongoose';
import { Budget, IBudget } from '@/models/Budget';
import { Category } from '@/models/Category';
import { Transaction } from '@/models/Transaction';
import { connectDB } from '@/lib/database/connection';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/utils/error-handler';
import { loggerService } from '@/lib/services/logger.service';
import type {
  BudgetCreateInput,
  BudgetUpdateInput,
  BudgetResponse,
  BudgetsListResponse,
  Budget as BudgetDTO,
  BudgetPeriod,
  BudgetProgress,
  BudgetProgressResponse,
} from '@/types/budget.types';

/**
 * Convert Mongoose document to plain Budget object
 */
function toBudgetObject(budget: IBudget): BudgetDTO {
  return {
    _id: budget._id.toString(),
    userId: budget.userId.toString(),
    name: budget.name,
    categoryId: budget.categoryId?.toString(),
    amount: budget.amount,
    currency: budget.currency,
    period: budget.period,
    startDate: budget.startDate,
    endDate: budget.endDate || undefined,
    alertThreshold: budget.alertThreshold || undefined,
    isActive: budget.isActive !== undefined ? budget.isActive : true,
    description: budget.description,
    color: budget.color,
    icon: budget.icon,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
}

/**
 * Calculate the end date for a budget period if endDate is not set
 * @param startDate - Budget start date
 * @param period - Budget period (weekly, monthly, yearly)
 * @returns Calculated end date
 */
function calculatePeriodEndDate(startDate: Date, period: BudgetPeriod): Date {
  const endDate = new Date(startDate);
  
  switch (period) {
    case 'weekly':
      endDate.setDate(endDate.getDate() + 7);
      break;
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case 'yearly':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
  }
  
  return endDate;
}

/**
 * Get the effective date range for budget progress calculation
 * @param budget - Budget document
 * @returns Object with startDate and endDate for calculation
 */
function getBudgetDateRange(budget: IBudget): { startDate: Date; endDate: Date | null } {
  const startDate = budget.startDate;
  let endDate: Date | null = budget.endDate || null;
  
  // If endDate is not set, calculate based on current period
  if (!endDate) {
    const now = new Date();
    const periodEnd = calculatePeriodEndDate(startDate, budget.period);
    
    // Use the earlier of: calculated period end or current date
    // This ensures we only calculate progress up to the current period
    if (periodEnd > now) {
      endDate = now;
    } else {
      // If we're past the period, use the period end
      endDate = periodEnd;
    }
  }
  
  return { startDate, endDate };
}

/**
 * Create a new budget
 * @param userId - User ID
 * @param input - Budget creation data
 * @returns Created budget
 */
export async function createBudget(
  userId: string,
  input: BudgetCreateInput
): Promise<BudgetResponse> {
  await connectDB();

  try {
    // Validate category exists and belongs to user if provided
    if (input.categoryId) {
      const category = await Category.findById(input.categoryId);
      if (!category) {
        throw new ValidationError('Category does not exist');
      }
      if (category.userId.toString() !== userId) {
        throw new ForbiddenError('Category does not belong to this user');
      }
      // Budgets should typically be for expense categories
      if (category.type === 'income') {
        throw new ValidationError('Budget cannot be created for income category');
      }
    }

    // Validate date range
    if (input.endDate && input.endDate <= input.startDate) {
      throw new ValidationError('End date must be after start date');
    }

    // Create budget
    const budget = new Budget({
      userId: new Types.ObjectId(userId),
      name: input.name.trim(),
      categoryId: input.categoryId ? new Types.ObjectId(input.categoryId) : null,
      amount: input.amount,
      currency: input.currency.toUpperCase().trim(),
      period: input.period,
      startDate: input.startDate,
      endDate: input.endDate || null,
      alertThreshold: input.alertThreshold || null,
      isActive: input.isActive !== undefined ? input.isActive : true,
      description: input.description?.trim(),
      color: input.color?.trim(),
      icon: input.icon?.trim(),
    });

    await budget.save();

    loggerService.logDatabase('CREATE', 'budgets', {
      userId,
      budgetId: budget._id.toString(),
      budgetName: budget.name,
      amount: budget.amount,
      period: budget.period,
    });
    loggerService.logUserAction('create_budget', userId, {
      budgetId: budget._id.toString(),
      budgetName: budget.name,
      amount: budget.amount,
    });

    return {
      budget: toBudgetObject(budget),
      message: 'Budget created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to create budget', error, { userId });
    throw new ValidationError('Failed to create budget');
  }
}

/**
 * Get all budgets for a user
 * @param userId - User ID
 * @param filters - Optional filters (isActive, period, categoryId)
 * @returns List of budgets
 */
export async function getUserBudgets(
  userId: string,
  filters?: {
    isActive?: boolean;
    period?: BudgetPeriod;
    categoryId?: string;
  }
): Promise<BudgetsListResponse> {
  await connectDB();

  try {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.period) {
      query.period = filters.period;
    }

    if (filters?.categoryId) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    const budgets = await Budget.find(query).sort({ startDate: -1 });

    loggerService.logDatabase('FIND', 'budgets', {
      userId,
      filters,
      count: budgets.length,
    });

    return {
      budgets: budgets.map(toBudgetObject),
      total: budgets.length,
      message: 'Budgets retrieved successfully',
    };
  } catch (error) {
    loggerService.error('Failed to get user budgets', error, { userId });
    throw new ValidationError('Failed to retrieve budgets');
  }
}

/**
 * Get budget by ID
 * @param userId - User ID
 * @param budgetId - Budget ID
 * @returns Budget
 */
export async function getBudgetById(
  userId: string,
  budgetId: string
): Promise<BudgetResponse> {
  await connectDB();

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      throw new NotFoundError('Budget', budgetId);
    }

    // Ensure budget belongs to the user
    if (budget.userId.toString() !== userId) {
      throw new ForbiddenError('Budget does not belong to this user');
    }

    loggerService.logDatabase('FIND', 'budgets', {
      userId,
      budgetId: budget._id.toString(),
    });

    return {
      budget: toBudgetObject(budget),
      message: 'Budget retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to get budget', error, { userId, budgetId });
    throw new ValidationError('Failed to retrieve budget');
  }
}

/**
 * Update budget
 * @param userId - User ID
 * @param budgetId - Budget ID
 * @param input - Budget update data
 * @returns Updated budget
 */
export async function updateBudget(
  userId: string,
  budgetId: string,
  input: BudgetUpdateInput
): Promise<BudgetResponse> {
  await connectDB();

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      throw new NotFoundError('Budget', budgetId);
    }

    // Ensure budget belongs to the user
    if (budget.userId.toString() !== userId) {
      throw new ForbiddenError('Budget does not belong to this user');
    }

    // Validate category if being updated
    if (input.categoryId !== undefined) {
      if (input.categoryId) {
        const category = await Category.findById(input.categoryId);
        if (!category) {
          throw new ValidationError('Category does not exist');
        }
        if (category.userId.toString() !== userId) {
          throw new ForbiddenError('Category does not belong to this user');
        }
        if (category.type === 'income') {
          throw new ValidationError('Budget cannot be assigned to income category');
        }
      }
    }

    // Validate date range if dates are being updated
    const startDate = input.startDate || budget.startDate;
    const endDate = input.endDate !== undefined ? input.endDate : budget.endDate;
    if (endDate && endDate <= startDate) {
      throw new ValidationError('End date must be after start date');
    }

    // Update budget fields
    if (input.name !== undefined) {
      budget.name = input.name.trim();
    }
    if (input.categoryId !== undefined) {
      budget.categoryId = input.categoryId ? new Types.ObjectId(input.categoryId) : null;
    }
    if (input.amount !== undefined) {
      budget.amount = input.amount;
    }
    if (input.currency !== undefined) {
      budget.currency = input.currency.toUpperCase().trim();
    }
    if (input.period !== undefined) {
      budget.period = input.period;
    }
    if (input.startDate !== undefined) {
      budget.startDate = input.startDate;
    }
    if (input.endDate !== undefined) {
      budget.endDate = input.endDate !== null ? input.endDate : null;
    }
    if (input.alertThreshold !== undefined) {
      budget.alertThreshold = input.alertThreshold !== null ? input.alertThreshold : null;
    }
    if (input.isActive !== undefined) {
      budget.isActive = input.isActive;
    }
    if (input.description !== undefined) {
      budget.description = input.description !== null ? input.description.trim() : null;
    }
    if (input.color !== undefined) {
      budget.color = input.color !== null ? input.color.trim() : null;
    }
    if (input.icon !== undefined) {
      budget.icon = input.icon !== null ? input.icon.trim() : null;
    }

    await budget.save();

    loggerService.logDatabase('UPDATE', 'budgets', {
      userId,
      budgetId: budget._id.toString(),
    });
    loggerService.logUserAction('update_budget', userId, {
      budgetId: budget._id.toString(),
      fields: Object.keys(input),
    });

    return {
      budget: toBudgetObject(budget),
      message: 'Budget updated successfully',
    };
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to update budget', error, { userId, budgetId });
    throw new ValidationError('Failed to update budget');
  }
}

/**
 * Delete budget
 * @param userId - User ID
 * @param budgetId - Budget ID
 */
export async function deleteBudget(userId: string, budgetId: string): Promise<void> {
  await connectDB();

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      throw new NotFoundError('Budget', budgetId);
    }

    // Ensure budget belongs to the user
    if (budget.userId.toString() !== userId) {
      throw new ForbiddenError('Budget does not belong to this user');
    }

    await Budget.findByIdAndDelete(budgetId);

    loggerService.logDatabase('DELETE', 'budgets', {
      userId,
      budgetId,
      budgetName: budget.name,
    });
    loggerService.logUserAction('delete_budget', userId, {
      budgetId,
      budgetName: budget.name,
    });
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to delete budget', error, { userId, budgetId });
    throw new ValidationError('Failed to delete budget');
  }
}

// BudgetProgress and BudgetProgressResponse interfaces are defined in budget.types.ts

/**
 * Calculate budget progress and check alerts
 * @param userId - User ID
 * @param budgetId - Budget ID
 * @returns Budget with progress information
 */
export async function calculateBudgetProgress(
  userId: string,
  budgetId: string
): Promise<BudgetProgressResponse> {
  await connectDB();

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      throw new NotFoundError('Budget', budgetId);
    }

    // Ensure budget belongs to the user
    if (budget.userId.toString() !== userId) {
      throw new ForbiddenError('Budget does not belong to this user');
    }

    // Get effective date range for calculation
    const { startDate, endDate } = getBudgetDateRange(budget);

    // Build transaction query
    const transactionQuery: any = {
      userId: new Types.ObjectId(userId),
      type: 'expense', // Only count expense transactions
      currency: budget.currency, // Only match same currency
      date: { $gte: startDate },
    };

    // Add end date if available
    if (endDate) {
      transactionQuery.date.$lte = endDate;
    }

    // Filter by category if budget has a category
    if (budget.categoryId) {
      transactionQuery.categoryId = budget.categoryId;
    }

    // Aggregate transactions to calculate spent amount
    const transactionStats = await Transaction.aggregate([
      { $match: transactionQuery },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const spent = transactionStats.length > 0 ? transactionStats[0].totalSpent : 0;
    const transactionCount = transactionStats.length > 0 ? transactionStats[0].count : 0;
    const remaining = Math.max(0, budget.amount - spent);
    const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const isExceeded = spent > budget.amount;

    // Calculate period days
    const periodDays = endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate days remaining
    const now = new Date();
    const daysRemaining = endDate
      ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    // Check alerts
    let alertTriggered = false;
    let alertType: 'threshold' | 'exceeded' | null = null;
    let alertMessage: string | null = null;

    // Check if budget is exceeded
    if (isExceeded) {
      alertTriggered = true;
      alertType = 'exceeded';
      alertMessage = `Budget exceeded by ${(spent - budget.amount).toFixed(2)} ${budget.currency}`;
    }
    // Check if threshold is reached (if alertThreshold is set)
    else if (budget.alertThreshold !== null && budget.alertThreshold !== undefined) {
      if (percentageUsed >= budget.alertThreshold) {
        alertTriggered = true;
        alertType = 'threshold';
        alertMessage = `Budget has reached ${percentageUsed.toFixed(1)}% of the limit (${budget.alertThreshold}% threshold)`;
      }
    }

    const progress: BudgetProgress = {
      spent,
      remaining,
      percentageUsed: Math.round(percentageUsed * 100) / 100, // Round to 2 decimal places
      isExceeded,
      alertTriggered,
      alertType,
      alertMessage,
      transactionCount,
      startDate,
      endDate,
      periodDays,
      daysRemaining,
    };

    loggerService.logDatabase('CALCULATE', 'budgets', {
      userId,
      budgetId: budget._id.toString(),
      spent,
      percentageUsed: progress.percentageUsed,
      isExceeded,
    });

    return {
      budget: toBudgetObject(budget),
      progress,
      message: 'Budget progress calculated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to calculate budget progress', error, { userId, budgetId });
    throw new ValidationError('Failed to calculate budget progress');
  }
}

/**
 * Get budget progress (alias for calculateBudgetProgress for API consistency)
 * @param userId - User ID
 * @param budgetId - Budget ID
 * @returns Budget with progress information
 */
export async function getBudgetProgress(
  userId: string,
  budgetId: string
): Promise<BudgetProgressResponse> {
  return calculateBudgetProgress(userId, budgetId);
}

