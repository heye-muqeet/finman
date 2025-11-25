/**
 * Test Protected Route
 * GET /api/v1/test-protected
 * 
 * This endpoint is protected and requires a valid JWT token.
 * Used to test authentication middleware.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/test-protected
 * Protected route that returns user information
 */
export const GET = withAuth(async (
  request: NextRequest,
  { user }
) => {
  try {
    // Ensure database connection
    await connectDB();

    // Return user information
    return successResponse(
      {
        message: 'Authentication successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        timestamp: new Date().toISOString(),
      },
      'Protected route accessed successfully',
      200
    );
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
});

