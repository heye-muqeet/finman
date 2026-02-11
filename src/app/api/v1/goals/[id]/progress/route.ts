/**
 * Goal Progress API Endpoint
 * GET /api/v1/goals/[id]/progress - Get goal progress calculation
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { calculateGoalProgress } from '@/lib/services/goals.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/goals/[id]/progress
 * Get goal progress calculation including current amount, remaining, percentage complete, and estimated completion date
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
    // Path structure: /api/v1/goals/[id]/progress
    // So goalId is at index -2 (progress is -1)
    const goalId = pathParts[pathParts.length - 2];

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

    // Calculate goal progress
    const result = await calculateGoalProgress(user._id, goalId);

    return successResponse(
      {
        goal: result.goal,
        progress: result.progress,
      },
      result.message || 'Goal progress calculated successfully',
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
    console.error('Get goal progress error:', error);
    return handleError(error);
  }
});

