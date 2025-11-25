/**
 * Categories API Endpoint
 * GET /api/v1/categories - List user categories
 * POST /api/v1/categories - Create new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { createCategorySchema } from '@/lib/validators/category.validator';
import {
  createCategory,
  getUserCategories,
} from '@/lib/services/categories.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, ForbiddenError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';
import type { CategoryType } from '@/types/category.types';

/**
 * GET /api/v1/categories
 * Get all categories for the authenticated user
 * Query params: type (optional), includeSubcategories (optional, default: true)
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
    const type = searchParams.get('type') as CategoryType | null;
    const includeSubcategories = searchParams.get('includeSubcategories') !== 'false';

    // Validate type if provided
    if (type && !['income', 'expense', 'both'].includes(type)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category type. Must be one of: income, expense, both',
        },
        400
      );
    }

    // Get user categories
    const result = await getUserCategories(
      user._id,
      type || undefined,
      includeSubcategories
    );

    return successResponse(
      {
        categories: result.categories,
        total: result.total,
      },
      result.message || 'Categories retrieved successfully',
      200
    );
  } catch (error) {
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

    console.error('Get categories error:', error);
    return handleError(error);
  }
});

/**
 * POST /api/v1/categories
 * Create a new category for the authenticated user
 */
export const POST = withAuth(async (
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
    const validationResult = createCategorySchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category data',
          details: errors,
        },
        400
      );
    }

    const validatedData = validationResult.data;

    // Create category using category service
    const result = await createCategory(user._id, validatedData);

    return successResponse(
      {
        category: result.category,
      },
      result.message || 'Category created successfully',
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

    if (error instanceof ForbiddenError) {
      return errorResponse(
        {
          code: 'FORBIDDEN',
          message: error.message,
        },
        403
      );
    }

    // Handle duplicate category error
    if (
      error instanceof Error &&
      (error.message.includes('already exists') ||
        error.message.includes('duplicate'))
    ) {
      return errorResponse(
        {
          code: 'DUPLICATE_CATEGORY',
          message: error.message || 'Category with this name and type already exists',
        },
        409
      );
    }

    // Handle unknown errors
    console.error('Create category error:', error);
    return handleError(error);
  }
});

