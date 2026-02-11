/**
 * Goal Service
 * Handles goal CRUD operations and progress tracking
 */

import { Types } from 'mongoose';
import { Goal, IGoal } from '@/models/Goal';
import { connectDB } from '@/lib/database/connection';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/utils/error-handler';
import { loggerService } from '@/lib/services/logger.service';
import type {
  GoalCreateInput,
  GoalUpdateInput,
  GoalResponse,
  GoalsListResponse,
  Goal as GoalDTO,
  GoalCategory,
  GoalStatus,
  GoalProgress,
  GoalProgressResponse,
} from '@/types/goal.types';

/**
 * Convert Mongoose document to plain Goal object
 */
function toGoalObject(goal: IGoal): GoalDTO {
  return {
    _id: goal._id.toString(),
    userId: goal.userId.toString(),
    title: goal.title,
    description: goal.description,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    currency: goal.currency,
    targetDate: goal.targetDate || undefined,
    category: goal.category,
    status: goal.status,
    isCompleted: goal.isCompleted,
    color: goal.color,
    icon: goal.icon,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

/**
 * Create a new goal
 * @param userId - User ID
 * @param input - Goal creation data
 * @returns Created goal
 */
export async function createGoal(
  userId: string,
  input: GoalCreateInput
): Promise<GoalResponse> {
  await connectDB();

  try {
    // Validate targetDate if provided (should be in the future, but we'll allow past dates for flexibility)
    if (input.targetDate && input.targetDate < new Date()) {
      // Allow past dates but log a warning (user might be backdating a goal)
      loggerService.warn('Goal created with past target date', { userId, targetDate: input.targetDate });
    }

    // Validate currentAmount doesn't exceed targetAmount (allow it, but log)
    if (input.currentAmount !== undefined && input.currentAmount > input.targetAmount) {
      loggerService.warn('Goal created with currentAmount exceeding targetAmount', {
        userId,
        currentAmount: input.currentAmount,
        targetAmount: input.targetAmount,
      });
    }

    // Create goal
    const goal = new Goal({
      userId: new Types.ObjectId(userId),
      title: input.title.trim(),
      description: input.description?.trim(),
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount !== undefined ? input.currentAmount : 0,
      currency: input.currency.toUpperCase().trim(),
      targetDate: input.targetDate || null,
      category: input.category,
      status: input.status || 'active',
      isCompleted: input.isCompleted !== undefined ? input.isCompleted : false,
      color: input.color?.trim(),
      icon: input.icon?.trim(),
    });

    await goal.save();

    loggerService.logDatabase('CREATE', 'goals', {
      userId,
      goalId: goal._id.toString(),
      goalTitle: goal.title,
      targetAmount: goal.targetAmount,
      category: goal.category,
    });

    loggerService.logUserAction('create_goal', userId, {
      goalId: goal._id.toString(),
      goalTitle: goal.title,
      targetAmount: goal.targetAmount,
    });

    return {
      goal: toGoalObject(goal),
      message: 'Goal created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to create goal', error, { userId });
    throw new ValidationError('Failed to create goal');
  }
}

/**
 * Get all goals for a user
 * @param userId - User ID
 * @param filters - Optional filters (status, category, isCompleted)
 * @returns List of goals
 */
export async function getUserGoals(
  userId: string,
  filters?: {
    status?: GoalStatus;
    category?: GoalCategory;
    isCompleted?: boolean;
  }
): Promise<GoalsListResponse> {
  await connectDB();

  try {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filters?.status !== undefined) {
      query.status = filters.status;
    }

    if (filters?.category !== undefined) {
      query.category = filters.category;
    }

    if (filters?.isCompleted !== undefined) {
      query.isCompleted = filters.isCompleted;
    }

    const goals = await Goal.find(query).sort({ targetDate: -1, createdAt: -1 });

    loggerService.logDatabase('FIND', 'goals', {
      userId,
      filters,
      count: goals.length,
    });

    return {
      goals: goals.map(toGoalObject),
      total: goals.length,
      message: 'Goals retrieved successfully',
    };
  } catch (error) {
    loggerService.error('Failed to get user goals', error, { userId });
    throw new ValidationError('Failed to retrieve goals');
  }
}

/**
 * Get goal by ID
 * @param userId - User ID
 * @param goalId - Goal ID
 * @returns Goal
 */
export async function getGoalById(
  userId: string,
  goalId: string
): Promise<GoalResponse> {
  await connectDB();

  try {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Goal', goalId);
    }

    // Ensure goal belongs to the user
    if (goal.userId.toString() !== userId) {
      throw new ForbiddenError('Goal does not belong to this user');
    }

    loggerService.logDatabase('FIND', 'goals', {
      userId,
      goalId: goal._id.toString(),
    });

    return {
      goal: toGoalObject(goal),
      message: 'Goal retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to get goal', error, { userId, goalId });
    throw new ValidationError('Failed to retrieve goal');
  }
}

/**
 * Update goal
 * @param userId - User ID
 * @param goalId - Goal ID
 * @param input - Goal update data
 * @returns Updated goal
 */
export async function updateGoal(
  userId: string,
  goalId: string,
  input: GoalUpdateInput
): Promise<GoalResponse> {
  await connectDB();

  try {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Goal', goalId);
    }

    // Ensure goal belongs to the user
    if (goal.userId.toString() !== userId) {
      throw new ForbiddenError('Goal does not belong to this user');
    }

    // Validate targetDate if being updated
    if (input.targetDate !== undefined && input.targetDate !== null) {
      // Allow past dates (user might be backdating)
      // No validation needed, but we could add a warning if desired
    }

    // Validate currentAmount if being updated
    if (input.currentAmount !== undefined) {
      if (input.currentAmount < 0) {
        throw new ValidationError('Current amount cannot be negative');
      }
      // Allow currentAmount to exceed targetAmount (user can over-save)
    }

    // Validate targetAmount if being updated
    if (input.targetAmount !== undefined) {
      if (input.targetAmount <= 0) {
        throw new ValidationError('Target amount must be greater than 0');
      }
      // If currentAmount would exceed new targetAmount, that's okay (user can over-save)
    }

    // Update goal fields
    if (input.title !== undefined) {
      goal.title = input.title.trim();
    }
    if (input.description !== undefined) {
      goal.description = input.description !== null ? input.description.trim() : null;
    }
    if (input.targetAmount !== undefined) {
      goal.targetAmount = input.targetAmount;
    }
    if (input.currentAmount !== undefined) {
      goal.currentAmount = input.currentAmount;
    }
    if (input.currency !== undefined) {
      goal.currency = input.currency.toUpperCase().trim();
    }
    if (input.targetDate !== undefined) {
      goal.targetDate = input.targetDate !== null ? input.targetDate : null;
    }
    if (input.category !== undefined) {
      goal.category = input.category;
    }
    if (input.status !== undefined) {
      goal.status = input.status;
    }
    if (input.isCompleted !== undefined) {
      goal.isCompleted = input.isCompleted;
    }
    if (input.color !== undefined) {
      goal.color = input.color !== null ? input.color.trim() : null;
    }
    if (input.icon !== undefined) {
      goal.icon = input.icon !== null ? input.icon.trim() : null;
    }

    await goal.save();

    loggerService.logDatabase('UPDATE', 'goals', {
      userId,
      goalId: goal._id.toString(),
    });

    loggerService.logUserAction('update_goal', userId, {
      goalId: goal._id.toString(),
      fields: Object.keys(input),
    });

    return {
      goal: toGoalObject(goal),
      message: 'Goal updated successfully',
    };
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to update goal', error, { userId, goalId });
    throw new ValidationError('Failed to update goal');
  }
}

/**
 * Delete goal
 * @param userId - User ID
 * @param goalId - Goal ID
 */
export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  await connectDB();

  try {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Goal', goalId);
    }

    // Ensure goal belongs to the user
    if (goal.userId.toString() !== userId) {
      throw new ForbiddenError('Goal does not belong to this user');
    }

    await Goal.findByIdAndDelete(goalId);

    loggerService.logDatabase('DELETE', 'goals', {
      userId,
      goalId,
      goalTitle: goal.title,
    });

    loggerService.logUserAction('delete_goal', userId, {
      goalId,
      goalTitle: goal.title,
    });
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to delete goal', error, { userId, goalId });
    throw new ValidationError('Failed to delete goal');
  }
}

/**
 * Calculate goal progress
 * @param userId - User ID
 * @param goalId - Goal ID
 * @returns Goal with progress information
 */
export async function calculateGoalProgress(
  userId: string,
  goalId: string
): Promise<GoalProgressResponse> {
  await connectDB();

  try {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Goal', goalId);
    }

    // Ensure goal belongs to the user
    if (goal.userId.toString() !== userId) {
      throw new ForbiddenError('Goal does not belong to this user');
    }

    // Use model instance methods for basic calculations
    const percentageComplete = goal.getProgressPercentage();
    const isOverdue = goal.isOverdue();
    const daysRemaining = goal.getDaysRemaining();

    // Calculate remaining amount
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

    // Calculate days elapsed (from creation date)
    const now = new Date();
    const daysElapsed = Math.floor(
      (now.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate estimated completion date
    // Based on average daily contribution rate, but consider targetDate if available
    let estimatedCompletionDate: Date | null = null;
    if (daysElapsed > 0 && goal.currentAmount > 0 && goal.currentAmount < goal.targetAmount) {
      const averageDailyRate = goal.currentAmount / daysElapsed;
      if (averageDailyRate > 0) {
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        const daysToComplete = Math.ceil(remainingAmount / averageDailyRate);
        const calculatedDate = new Date(now);
        calculatedDate.setDate(calculatedDate.getDate() + daysToComplete);
        
        // If targetDate exists and is sooner than calculated date, use targetDate
        // Otherwise, use the calculated date based on current rate
        if (goal.targetDate) {
          estimatedCompletionDate = goal.targetDate < calculatedDate 
            ? new Date(goal.targetDate) 
            : calculatedDate;
        } else {
          estimatedCompletionDate = calculatedDate;
        }
      } else if (goal.targetDate) {
        // If no progress history but targetDate exists, use targetDate
        estimatedCompletionDate = new Date(goal.targetDate);
      }
    } else if (goal.targetDate && goal.currentAmount < goal.targetAmount) {
      // If we have a target date but no progress history, use target date as estimate
      estimatedCompletionDate = new Date(goal.targetDate);
    }

    const progress: GoalProgress = {
      currentAmount: goal.currentAmount,
      targetAmount: goal.targetAmount,
      remaining,
      percentageComplete: Math.round(percentageComplete * 100) / 100, // Round to 2 decimal places
      isCompleted: goal.isCompleted,
      isOverdue,
      daysRemaining,
      daysElapsed,
      estimatedCompletionDate,
    };

    loggerService.logDatabase('CALCULATE', 'goals', {
      userId,
      goalId: goal._id.toString(),
      currentAmount: goal.currentAmount,
      targetAmount: goal.targetAmount,
      percentageComplete: progress.percentageComplete,
      isCompleted: goal.isCompleted,
    });

    return {
      goal: toGoalObject(goal),
      progress,
      message: 'Goal progress calculated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to calculate goal progress', error, { userId, goalId });
    throw new ValidationError('Failed to calculate goal progress');
  }
}

/**
 * Get goal progress (alias for calculateGoalProgress for API consistency)
 * @param userId - User ID
 * @param goalId - Goal ID
 * @returns Goal with progress information
 */
export async function getGoalProgress(
  userId: string,
  goalId: string
): Promise<GoalProgressResponse> {
  return calculateGoalProgress(userId, goalId);
}

