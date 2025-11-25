/**
 * Transaction Statistics API Endpoint
 * GET /api/v1/transactions/stats - Get transaction statistics for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { getUserStats } from '@/lib/services/transactions.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/transactions/stats
 * Get transaction statistics for the authenticated user
 * Query params: startDate (optional), endDate (optional)
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
    
    // Parse optional date filters
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateStr) {
      startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        return errorResponse(
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid startDate format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
          },
          400
        );
      }
    }

    if (endDateStr) {
      endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) {
        return errorResponse(
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid endDate format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
          },
          400
        );
      }
    }

    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'startDate must be before or equal to endDate',
        },
        400
      );
    }

    // Get statistics using transaction service
    const stats = await getUserStats(user._id, startDate, endDate);

    return successResponse(
      {
        stats,
        filters: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      },
      'Transaction statistics retrieved successfully'
    );
  } catch (error) {
    // Handle unknown errors
    console.error('Get transaction stats error:', error);
    return handleError(error);
  }
});
