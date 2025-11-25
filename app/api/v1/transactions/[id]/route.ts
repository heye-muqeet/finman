/**
 * Single Transaction API Endpoint
 * GET /api/v1/transactions/[id] - Get transaction by ID
 * PUT /api/v1/transactions/[id] - Update transaction
 * DELETE /api/v1/transactions/[id] - Delete transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { updateTransactionSchema } from '@/lib/validators/transaction.validator';
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '@/lib/services/transactions.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';

/**
 * GET /api/v1/transactions/[id]
 * Get a single transaction by ID
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

    // Extract transaction ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const transactionId = pathParts[pathParts.length - 1];

    // Validate transaction ID format
    if (!/^[0-9a-fA-F]{24}$/.test(transactionId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction ID format',
        },
        400
      );
    }

    // Get transaction by ID
    const result = await getTransactionById(user._id, transactionId);

    return successResponse(
      {
        transaction: result.transaction,
      },
      result.message || 'Transaction retrieved successfully',
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
    console.error('Get transaction error:', error);
    return handleError(error);
  }
});

/**
 * PUT /api/v1/transactions/[id]
 * Update a transaction by ID
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

    // Extract transaction ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const transactionId = pathParts[pathParts.length - 1];

    // Validate transaction ID format
    if (!/^[0-9a-fA-F]{24}$/.test(transactionId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction ID format',
        },
        400
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = updateTransactionSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction data',
          details: errors,
        },
        400
      );
    }

    const validatedData = validationResult.data;

    // Update transaction using transaction service
    const result = await updateTransaction(user._id, transactionId, validatedData);

    return successResponse(
      {
        transaction: result.transaction,
      },
      result.message || 'Transaction updated successfully',
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
    console.error('Update transaction error:', error);
    return handleError(error);
  }
});

/**
 * DELETE /api/v1/transactions/[id]
 * Delete a transaction by ID
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

    // Extract transaction ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const transactionId = pathParts[pathParts.length - 1];

    // Validate transaction ID format
    if (!/^[0-9a-fA-F]{24}$/.test(transactionId)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction ID format',
        },
        400
      );
    }

    // Delete transaction using transaction service
    await deleteTransaction(user._id, transactionId);

    return successResponse(
      {},
      'Transaction deleted successfully',
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
    console.error('Delete transaction error:', error);
    return handleError(error);
  }
});

