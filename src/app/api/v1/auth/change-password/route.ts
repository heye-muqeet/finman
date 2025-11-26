/**
 * Change Password API Endpoint
 * POST /api/v1/auth/change-password - Change user password
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { authRateLimit } from '@/lib/middleware/rate-limit';
import { changePasswordSchema } from '@/lib/validators/auth.validator';
import { changePassword } from '@/lib/services/auth.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * POST /api/v1/auth/change-password
 * Change user password
 * Requires current password verification
 */
export const POST = withAuth(async (
  request: NextRequest,
  { user }
) => {
  try {
    // Apply rate limiting (stricter for password changes)
    const rateLimitResponse = await authRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Ensure database connection
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid password change data',
          details: errors,
        },
        400
      );
    }

    // Check if new password is same as current password
    if (validationResult.data.currentPassword === validationResult.data.newPassword) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'New password must be different from current password',
        },
        400
      );
    }

    // Change password
    await changePassword(
      user._id,
      validationResult.data.currentPassword,
      validationResult.data.newPassword
    );

    return successResponse(
      null,
      'Password changed successfully'
    );
  } catch (error) {
    console.error('Change password error:', error);
    return handleError(error);
  }
});

