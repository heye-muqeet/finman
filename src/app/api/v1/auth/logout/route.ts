/**
 * Logout API Endpoint
 * POST /api/v1/auth/logout - Logout user and invalidate tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { authRateLimit } from '@/lib/middleware/rate-limit';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * POST /api/v1/auth/logout
 * Logout user
 * Invalidates the current session (client-side token clearing is handled by frontend)
 * 
 * Note: Since we're using stateless JWT tokens, we don't need to invalidate them server-side.
 * The client will clear the tokens from localStorage. For enhanced security, you could implement
 * a token blacklist or use refresh tokens that can be invalidated.
 */
export const POST = withAuth(async (
  request: NextRequest,
  { user }
) => {
  try {
    // Apply rate limiting (stricter for auth endpoints)
    const rateLimitResponse = await authRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Ensure database connection
    await connectDB();

    // Optional: Log logout activity (for audit purposes)
    // You could update user's lastLogoutAt timestamp or log to audit trail
    // For now, we'll just return success since JWT tokens are stateless

    return successResponse(
      null,
      'Logged out successfully'
    );
  } catch (error) {
    console.error('Logout error:', error);
    return handleError(error);
  }
});

