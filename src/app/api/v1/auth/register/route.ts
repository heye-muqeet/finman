/**
 * User Registration API Endpoint
 * POST /api/v1/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators/auth.validator';
import { registerUser } from '@/lib/services/auth.service';
import { authRateLimit } from '@/lib/middleware/rate-limit';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * POST /api/v1/auth/register
 * Register a new user
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
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration data',
          details: errors,
        },
        400
      );
    }

    const validatedData = validationResult.data;

    // Register user using auth service
    const result = await registerUser({
      email: validatedData.email,
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      currency: validatedData.currency || 'USD',
      timezone: validatedData.timezone || 'UTC',
    });

    // Return success response
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
          createdAt: result.user.createdAt,
        },
        token: result.token,
        refreshToken: result.refreshToken,
      },
      result.message || 'User registered successfully',
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

    // Handle duplicate email error
    if (
      error instanceof Error &&
      (error.message.includes('duplicate') ||
        error.message.includes('already exists') ||
        error.message.includes('E11000'))
    ) {
      return errorResponse(
        {
          code: 'DUPLICATE_EMAIL',
          message: 'User with this email already exists',
        },
        409
      );
    }

    // Handle unknown errors
    console.error('Registration error:', error);
    return handleError(error);
  }
}

