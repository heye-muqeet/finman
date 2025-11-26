/**
 * Budgets API Endpoint
 * GET /api/v1/budgets - List user budgets
 * POST /api/v1/budgets - Create new budget
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { createBudgetSchema } from '@/lib/validators/budget.validator';
import {
  createBudget,
  getUserBudgets,
} from '@/lib/services/budgets.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, ForbiddenError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';
import type { BudgetPeriod } from '@/types/budget.types';

/**
 * GET /api/v1/budgets
 * Get all budgets for the authenticated user
 * Query params: isActive (optional), period (optional), categoryId (optional)
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
    const isActiveParam = searchParams.get('isActive');
    const period = searchParams.get('period') as BudgetPeriod | null;
    const categoryId = searchParams.get('categoryId');

    // Build filters object
    const filters: {
      isActive?: boolean;
      period?: BudgetPeriod;
      categoryId?: string;
    } = {};

    if (isActiveParam !== null) {
      filters.isActive = isActiveParam === 'true';
    }

    if (period) {
      if (!['weekly', 'monthly', 'yearly'].includes(period)) {
        return errorResponse(
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid budget period. Must be one of: weekly, monthly, yearly',
          },
          400
        );
      }
      filters.period = period;
    }

    if (categoryId) {
      // Validate category ID format
      if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return errorResponse(
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid category ID format',
          },
          400
        );
      }
      filters.categoryId = categoryId;
    }

    // Get user budgets
    const result = await getUserBudgets(user._id, Object.keys(filters).length > 0 ? filters : undefined);

    return successResponse(
      {
        budgets: result.budgets,
        total: result.total,
      },
      result.message || 'Budgets retrieved successfully',
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

    console.error('Get budgets error:', error);
    return handleError(error);
  }
});

/**
 * POST /api/v1/budgets
 * Create a new budget for the authenticated user
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
    const validationResult = createBudgetSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid budget data',
          details: errors,
        },
        400
      );
    }

    const validatedData = validationResult.data;

    // Create budget using budget service
    const result = await createBudget(user._id, validatedData);

    return successResponse(
      {
        budget: result.budget,
      },
      result.message || 'Budget created successfully',
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
    console.error('Create budget error:', error);
    return handleError(error);
  }
});

