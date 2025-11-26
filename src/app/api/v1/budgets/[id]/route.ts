/**
 * Single Budget API Endpoint
 * GET /api/v1/budgets/[id] - Get budget by ID
 * PUT /api/v1/budgets/[id] - Update budget
 * DELETE /api/v1/budgets/[id] - Delete budget
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { updateBudgetSchema } from '@/lib/validators/budget.validator';
import {
  getBudgetById,
  updateBudget,
  deleteBudget,
} from '@/lib/services/budgets.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/budgets/[id]
 * Get a single budget by ID
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

    // Extract budget ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const budgetId = pathParts[pathParts.length - 1];

    // Validate budget ID format
    if (!/^[0-9a-fA-F]{24}$/.test(budgetId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid budget ID format',
        },
        400
      );
    }

    // Get budget by ID
    const result = await getBudgetById(user._id, budgetId);

    return successResponse(
      {
        budget: result.budget,
      },
      result.message || 'Budget retrieved successfully',
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
    console.error('Get budget error:', error);
    return handleError(error);
  }
});

/**
 * PUT /api/v1/budgets/[id]
 * Update a budget by ID
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

    // Extract budget ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const budgetId = pathParts[pathParts.length - 1];

    // Validate budget ID format
    if (!/^[0-9a-fA-F]{24}$/.test(budgetId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid budget ID format',
        },
        400
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = updateBudgetSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid budget data',
          details: errors,
        },
        400
      );
    }

    const validatedData = validationResult.data;

    // Build update data, preserving null values to allow clearing fields
    const updateData: {
      name?: string;
      categoryId?: string | null;
      amount?: number;
      currency?: string;
      period?: 'weekly' | 'monthly' | 'yearly';
      startDate?: Date;
      endDate?: Date | null;
      alertThreshold?: number | null;
      isActive?: boolean;
      description?: string | null;
      color?: string | null;
      icon?: string | null;
    } = {};

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId;
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount;
    if (validatedData.currency !== undefined) updateData.currency = validatedData.currency;
    if (validatedData.period !== undefined) updateData.period = validatedData.period;
    if (validatedData.startDate !== undefined) updateData.startDate = validatedData.startDate;
    // Preserve null values to allow clearing fields
    if (validatedData.endDate !== undefined) {
      updateData.endDate = validatedData.endDate;
    }
    if (validatedData.alertThreshold !== undefined) {
      updateData.alertThreshold = validatedData.alertThreshold;
    }
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    if (validatedData.color !== undefined) {
      updateData.color = validatedData.color;
    }
    if (validatedData.icon !== undefined) {
      updateData.icon = validatedData.icon;
    }

    // Update budget using budget service
    const result = await updateBudget(user._id, budgetId, updateData);

    return successResponse(
      {
        budget: result.budget,
      },
      result.message || 'Budget updated successfully',
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
    console.error('Update budget error:', error);
    return handleError(error);
  }
});

/**
 * DELETE /api/v1/budgets/[id]
 * Delete a budget by ID
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

    // Extract budget ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const budgetId = pathParts[pathParts.length - 1];

    // Validate budget ID format
    if (!/^[0-9a-fA-F]{24}$/.test(budgetId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid budget ID format',
        },
        400
      );
    }

    // Delete budget using budget service
    await deleteBudget(user._id, budgetId);

    return successResponse(
      {},
      'Budget deleted successfully',
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
    console.error('Delete budget error:', error);
    return handleError(error);
  }
});

