/**
 * User Login API Endpoint
 * POST /api/v1/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/auth.validator';
import { loginUser } from '@/lib/services/auth.service';
import { authRateLimit } from '@/lib/middleware/rate-limit';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { UnauthorizedError, ValidationError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * POST /api/v1/auth/login
 * Login user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await authRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Ensure database connection
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid login data',
          details: errors,
        },
        400
      );
    }

    const { email, password } = validationResult.data;

    // Login user using auth service
    const result = await loginUser(email, password);

    // Check if 2FA is required
    if (result.message === '2FA verification required') {
      return successResponse(
        {
          user: {
            _id: result.user._id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            twoFactorEnabled: result.user.twoFactorEnabled,
          },
          requires2FA: true,
        },
        result.message,
        200
      );
    }

    // Return success response with tokens
    return successResponse(
      {
        user: {
          _id: result.user._id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          currency: result.user.currency,
          timezone: result.user.timezone,
          preferences: result.user.preferences,
          twoFactorEnabled: result.user.twoFactorEnabled,
          lastLoginAt: result.user.lastLoginAt,
        },
        token: result.token,
        refreshToken: result.refreshToken,
      },
      result.message || 'Login successful',
      200
    );
  } catch (error) {
    // Handle known errors
    if (error instanceof UnauthorizedError) {
      return errorResponse(
        {
          code: 'UNAUTHORIZED',
          message: error.message || 'Invalid email or password',
        },
        401
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
    console.error('Login error:', error);
    return handleError(error);
  }
}

