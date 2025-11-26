/**
 * Dashboard Summary API Endpoint
 * GET /api/v1/dashboard/summary - Get dashboard summary data for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { getDashboardSummary } from '@/lib/services/dashboard.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';
import { User } from '@/models/User';

/**
 * GET /api/v1/dashboard/summary
 * Get dashboard summary data for the authenticated user
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

    // Get user's preferred currency from database
    const userDoc = await User.findById(user._id).select('currency').lean();
    const currency = userDoc?.currency || 'USD';

    // Get dashboard summary
    const summary = await getDashboardSummary(user._id, currency);

    return successResponse(
      summary,
      'Dashboard summary retrieved successfully'
    );
  } catch (error) {
    // Handle unknown errors
    console.error('Get dashboard summary error:', error);
    return handleError(error);
  }
});

