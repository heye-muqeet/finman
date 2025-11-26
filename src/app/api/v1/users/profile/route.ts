/**
 * User Profile API Endpoint
 * GET /api/v1/users/profile - Get current user profile
 * PUT /api/v1/users/profile - Update current user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { updateProfileSchema } from '@/lib/validators/user.validator';
import { getUserProfile, updateUserProfile } from '@/lib/services/users.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/users/profile
 * Get current user profile
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

    // Get user profile
    const profile = await getUserProfile(user._id);

    return successResponse(
      profile,
      'User profile retrieved successfully'
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return handleError(error);
  }
});

/**
 * PUT /api/v1/users/profile
 * Update current user profile
 * Note: Password updates are handled separately via /api/v1/auth/change-password
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

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid profile update data',
          details: errors,
        },
        400
      );
    }

    // Check if password is being updated (should use change-password endpoint)
    if ('password' in body) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Password cannot be updated through this endpoint. Use /api/v1/auth/change-password instead',
        },
        400
      );
    }

    // Check if email is being updated (email updates should be handled separately)
    if ('email' in body) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Email cannot be updated through this endpoint',
        },
        400
      );
    }

    // Update user profile
    const updatedProfile = await updateUserProfile(user._id, validationResult.data);

    return successResponse(
      updatedProfile,
      'User profile updated successfully'
    );
  } catch (error) {
    console.error('Update user profile error:', error);
    return handleError(error);
  }
});

