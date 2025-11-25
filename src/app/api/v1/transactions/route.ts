/**
 * Transactions API Endpoint
 * GET /api/v1/transactions - List user transactions with filters
 * POST /api/v1/transactions - Create new transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { createTransactionSchema } from '@/lib/validators/transaction.validator';
import {
  createTransaction,
  getTransactions,
} from '@/lib/services/transactions.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, ForbiddenError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';
import type {
  TransactionType,
  PaymentMethod,
  TransactionFilters,
} from '@/types/transaction.types';

/**
 * GET /api/v1/transactions
 * Get all transactions for the authenticated user with filters and pagination
 * Query params: type, categoryId, minAmount, maxAmount, startDate, endDate, paymentMethod, tags, search, page, limit, sortBy, sortOrder
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

    // Build filters object
    const filters: TransactionFilters = {};

    // Type filter
    const type = searchParams.get('type');
    if (type && ['income', 'expense'].includes(type)) {
      filters.type = type as TransactionType;
    }

    // Category filter
    const categoryId = searchParams.get('categoryId');
    if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
      filters.categoryId = categoryId;
    }

    // Amount range filters
    const minAmount = searchParams.get('minAmount');
    if (minAmount) {
      const parsed = parseFloat(minAmount);
      if (!isNaN(parsed) && parsed >= 0) {
        filters.minAmount = parsed;
      }
    }

    const maxAmount = searchParams.get('maxAmount');
    if (maxAmount) {
      const parsed = parseFloat(maxAmount);
      if (!isNaN(parsed) && parsed >= 0) {
        filters.maxAmount = parsed;
      }
    }

    // Date range filters
    const startDate = searchParams.get('startDate');
    if (startDate) {
      const parsed = new Date(startDate);
      if (!isNaN(parsed.getTime())) {
        filters.startDate = parsed;
      }
    }

    const endDate = searchParams.get('endDate');
    if (endDate) {
      const parsed = new Date(endDate);
      if (!isNaN(parsed.getTime())) {
        filters.endDate = parsed;
      }
    }

    // Payment method filter
    const paymentMethod = searchParams.get('paymentMethod');
    if (
      paymentMethod &&
      ['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'].includes(
        paymentMethod
      )
    ) {
      filters.paymentMethod = paymentMethod as PaymentMethod;
    }

    // Tags filter (comma-separated)
    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    // Search filter (text search)
    const search = searchParams.get('search');
    if (search) {
      filters.search = search.trim();
    }

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate pagination
    if (page < 1) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Page must be greater than 0',
        },
        400
      );
    }

    if (limit < 1 || limit > 100) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Limit must be between 1 and 100',
        },
        400
      );
    }

    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Validate sortBy
    const validSortFields = [
      'date',
      'amount',
      'type',
      'createdAt',
      'updatedAt',
    ];
    if (!validSortFields.includes(sortBy)) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: `Invalid sortBy field. Must be one of: ${validSortFields.join(', ')}`,
        },
        400
      );
    }

    // Get transactions using service
    const result = await getTransactions(user._id, {
      filters,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return successResponse(
      {
        transactions: result.transactions,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
      result.message || 'Transactions retrieved successfully',
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

    console.error('Get transactions error:', error);
    return handleError(error);
  }
});

/**
 * POST /api/v1/transactions
 * Create a new transaction for the authenticated user
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
    const validationResult = createTransactionSchema.safeParse(body);

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

    // Create transaction using transaction service
    const result = await createTransaction(user._id, validatedData);

    return successResponse(
      {
        transaction: result.transaction,
      },
      result.message || 'Transaction created successfully',
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

    // Handle unknown errors
    console.error('Create transaction error:', error);
    return handleError(error);
  }
});

