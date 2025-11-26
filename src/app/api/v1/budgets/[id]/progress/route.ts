/**
 * Budget Progress API Endpoint
 * GET /api/v1/budgets/[id]/progress - Get budget progress and alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { calculateBudgetProgress } from '@/lib/services/budgets.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/budgets/[id]/progress
 * Get budget progress calculation including spent amount, remaining, percentage used, and alerts
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

    // Extract budget ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Path structure: /api/v1/budgets/[id]/progress
    // So budgetId is at index -2 (progress is -1)
    const budgetId = pathParts[pathParts.length - 2];

    // Validate budget ID format
    if (!/^[0-9a-fA-F]{24}$/.test(budgetId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid budget ID format',
        },
        400
      );
    }

    // Calculate budget progress
    const result = await calculateBudgetProgress(user._id, budgetId);

    return successResponse(
      {
        budget: result.budget,
        progress: result.progress,
      },
      result.message || 'Budget progress calculated successfully',
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
    console.error('Get budget progress error:', error);
    return handleError(error);
  }
});

