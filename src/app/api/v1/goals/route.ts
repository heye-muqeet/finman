/**
 * Goals API Endpoint
 * GET /api/v1/goals - List user goals
 * POST /api/v1/goals - Create new goal
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { createGoalSchema } from '@/lib/validators/goal.validator';
import {
  createGoal,
  getUserGoals,
} from '@/lib/services/goals.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, ForbiddenError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';
import type { GoalCategory, GoalStatus } from '@/types/goal.types';

/**
 * GET /api/v1/goals
 * Get all goals for the authenticated user
 * Query params: status (optional), category (optional), isCompleted (optional)
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as GoalStatus | null;
    const category = searchParams.get('category') as GoalCategory | null;
    const isCompletedParam = searchParams.get('isCompleted');

    // Build filters object
    const filters: {
      status?: GoalStatus;
      category?: GoalCategory;
      isCompleted?: boolean;
    } = {};

    if (status) {
      if (!['active', 'completed', 'paused', 'cancelled'].includes(status)) {
        return errorResponse(
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid goal status. Must be one of: active, completed, paused, cancelled',
          },
          400
        );
      }
      filters.status = status;
    }

    if (category) {
      if (!['savings', 'debt_payoff', 'investment', 'purchase', 'other'].includes(category)) {
        return errorResponse(
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid goal category. Must be one of: savings, debt_payoff, investment, purchase, other',
          },
          400
        );
      }
      filters.category = category;
    }

    if (isCompletedParam !== null) {
      filters.isCompleted = isCompletedParam === 'true';
    }

    // Get user goals
    const result = await getUserGoals(user._id, Object.keys(filters).length > 0 ? filters : undefined);

    return successResponse(
      {
        goals: result.goals,
        total: result.total,
      },
      result.message || 'Goals retrieved successfully',
      200
    );
  } catch (error) {
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

    console.error('Get goals error:', error);
    return handleError(error);
  }
});

/**
 * POST /api/v1/goals
 * Create a new goal for the authenticated user
 */
export const POST = withAuth(async (
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

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = createGoalSchema.safeParse(body);

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

    // Create goal using goal service
    const result = await createGoal(user._id, validatedData);

    return successResponse(
      {
        goal: result.goal,
      },
      result.message || 'Goal created successfully',
      201
    );
  } catch (error) {
    // Handle known errors
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

    if (error instanceof ForbiddenError) {
      return errorResponse(
        {
          code: 'FORBIDDEN',
          message: error.message,
        },
        403
      );
    }

    // Handle unknown errors
    console.error('Create goal error:', error);
    return handleError(error);
  }
});

