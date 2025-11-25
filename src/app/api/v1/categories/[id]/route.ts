/**
 * Single Category API Endpoint
 * GET /api/v1/categories/[id] - Get category by ID
 * PUT /api/v1/categories/[id] - Update category
 * DELETE /api/v1/categories/[id] - Delete category
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { updateCategorySchema } from '@/lib/validators/category.validator';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/lib/services/categories.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/categories/[id]
 * Get a single category by ID
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

    // Extract category ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const categoryId = pathParts[pathParts.length - 1];

    // Validate category ID format
    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category ID format',
        },
        400
      );
    }

    // Get category by ID
    const result = await getCategoryById(user._id, categoryId);

    return successResponse(
      {
        category: result.category,
      },
      result.message || 'Category retrieved successfully',
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
    console.error('Get category error:', error);
    return handleError(error);
  }
});

/**
 * PUT /api/v1/categories/[id]
 * Update a category by ID
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

    // Extract category ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const categoryId = pathParts[pathParts.length - 1];

    // Validate category ID format
    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category ID format',
        },
        400
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = updateCategorySchema.safeParse(body);

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

    // Build update data, preserving null values to allow clearing fields
    const updateData: {
      name?: string;
      type?: 'income' | 'expense' | 'both';
      icon?: string | null;
      color?: string | null;
      parentCategoryId?: string | null;
      isDefault?: boolean;
    } = {};

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    // Preserve null values to allow clearing fields
    if (validatedData.icon !== undefined) {
      updateData.icon = validatedData.icon;
    }
    if (validatedData.color !== undefined) {
      updateData.color = validatedData.color;
    }
    if (validatedData.parentCategoryId !== undefined) {
      updateData.parentCategoryId = validatedData.parentCategoryId;
    }
    if (validatedData.isDefault !== undefined) updateData.isDefault = validatedData.isDefault;

    // Update category using category service
    const result = await updateCategory(user._id, categoryId, updateData);

    return successResponse(
      {
        category: result.category,
      },
      result.message || 'Category updated successfully',
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

    // Check for duplicate category error before general ValidationError handler
    // (duplicate errors are thrown as ValidationError but should return 409)
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
    console.error('Update category error:', error);
    return handleError(error);
  }
});

/**
 * DELETE /api/v1/categories/[id]
 * Delete a category by ID
 */
export const DELETE = withAuth(async (
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

    // Extract category ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const categoryId = pathParts[pathParts.length - 1];

    // Validate category ID format
    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category ID format',
        },
        400
      );
    }

    // Delete category using category service
    await deleteCategory(user._id, categoryId);

    return successResponse(
      {},
      'Category deleted successfully',
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
    console.error('Delete category error:', error);
    return handleError(error);
  }
});

