/**
 * Single Goal API Endpoint
 * GET /api/v1/goals/[id] - Get goal by ID
 * PUT /api/v1/goals/[id] - Update goal
 * DELETE /api/v1/goals/[id] - Delete goal
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { updateGoalSchemaWithPreprocess } from '@/lib/validators/goal.validator';
import {
  getGoalById,
  updateGoal,
  deleteGoal,
} from '@/lib/services/goals.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/goals/[id]
 * Get a single goal by ID
 */
export const GET = withAuth(async (
  request: NextRequest,
  { user }
) => {
  try {
    // Apply rate limiting
    const rateLimitResponse = await standardRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Ensure database connection
    await connectDB();

    // Extract goal ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const goalId = pathParts[pathParts.length - 1];

    // Validate goal ID format
    if (!/^[0-9a-fA-F]{24}$/.test(goalId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid goal ID format',
        },
        400
      );
    }

    // Get goal by ID
    const result = await getGoalById(user._id, goalId);

    return successResponse(
      {
        goal: result.goal,
      },
      result.message || 'Goal retrieved successfully',
      200
    );
  } catch (error) {
    // Handle known errors
    if (error instanceof NotFoundError) {
      return errorResponse(
        {
          code: 'NOT_FOUND',
          message: error.message,
        },
        404
      );
    }

    if (error instanceof ForbiddenError) {
      return errorResponse(
        {
          code: 'FORBIDDEN',
          message: error.message,
        },
        403
      );
    }

    if (error instanceof ValidationError) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.details,
        },
        400
      );
    }

    // Handle unknown errors
    console.error('Get goal error:', error);
    return handleError(error);
  }
});

/**
 * PUT /api/v1/goals/[id]
 * Update a goal by ID
 */
export const PUT = withAuth(async (
  request: NextRequest,
  { user }
) => {
  try {
    // Apply rate limiting
    const rateLimitResponse = await standardRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Ensure database connection
    await connectDB();

    // Extract goal ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const goalId = pathParts[pathParts.length - 1];

    // Validate goal ID format
    if (!/^[0-9a-fA-F]{24}$/.test(goalId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid goal ID format',
        },
        400
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = updateGoalSchemaWithPreprocess.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid goal data',
          details: errors,
        },
        400
      );
    }

    const validatedData = validationResult.data;

    // Build update data, preserving null values to allow clearing fields
    const updateData: {
      title?: string;
      description?: string | null;
      targetAmount?: number;
      currentAmount?: number;
      currency?: string;
      targetDate?: Date | null;
      category?: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'other';
      status?: 'active' | 'completed' | 'paused' | 'cancelled';
      isCompleted?: boolean;
      color?: string | null;
      icon?: string | null;
    } = {};

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.targetAmount !== undefined) updateData.targetAmount = validatedData.targetAmount;
    if (validatedData.currentAmount !== undefined) updateData.currentAmount = validatedData.currentAmount;
    if (validatedData.currency !== undefined) updateData.currency = validatedData.currency;
    // Preserve null values to allow clearing fields
    if (validatedData.targetDate !== undefined) {
      updateData.targetDate = validatedData.targetDate;
    }
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;
    if (validatedData.isCompleted !== undefined) updateData.isCompleted = validatedData.isCompleted;
    if (validatedData.color !== undefined) {
      updateData.color = validatedData.color;
    }
    if (validatedData.icon !== undefined) {
      updateData.icon = validatedData.icon;
    }

    // Update goal using goal service
    const result = await updateGoal(user._id, goalId, updateData);

    return successResponse(
      {
        goal: result.goal,
      },
      result.message || 'Goal updated successfully',
      200
    );
  } catch (error) {
    // Handle known errors
    if (error instanceof NotFoundError) {
      return errorResponse(
        {
          code: 'NOT_FOUND',
          message: error.message,
        },
        404
      );
    }

    if (error instanceof ForbiddenError) {
      return errorResponse(
        {
          code: 'FORBIDDEN',
          message: error.message,
        },
        403
      );
    }

    if (error instanceof ValidationError) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.details,
        },
        400
      );
    }

    // Handle unknown errors
    console.error('Update goal error:', error);
    return handleError(error);
  }
});

/**
 * DELETE /api/v1/goals/[id]
 * Delete a goal by ID
 */
export const DELETE = withAuth(async (
  request: NextRequest,
  { user }
) => {
  try {
    // Apply rate limiting
    const rateLimitResponse = await standardRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Ensure database connection
    await connectDB();

    // Extract goal ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const goalId = pathParts[pathParts.length - 1];

    // Validate goal ID format
    if (!/^[0-9a-fA-F]{24}$/.test(goalId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid goal ID format',
        },
        400
      );
    }

    // Delete goal using goal service
    await deleteGoal(user._id, goalId);

    return successResponse(
      {},
      'Goal deleted successfully',
      200
    );
  } catch (error) {
    // Handle known errors
    if (error instanceof NotFoundError) {
      return errorResponse(
        {
          code: 'NOT_FOUND',
          message: error.message,
        },
        404
      );
    }

    if (error instanceof ForbiddenError) {
      return errorResponse(
        {
          code: 'FORBIDDEN',
          message: error.message,
        },
        403
      );
    }

    if (error instanceof ValidationError) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.details,
        },
        400
      );
    }

    // Handle unknown errors
    console.error('Delete goal error:', error);
    return handleError(error);
  }
});

