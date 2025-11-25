/**
 * Bulk Transaction API Endpoint
 * POST /api/v1/transactions/bulk - Create multiple transactions at once
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { standardRateLimit } from '@/lib/middleware/rate-limit';
import { createTransactionSchema } from '@/lib/validators/transaction.validator';
import { createTransaction } from '@/lib/services/transactions.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, ForbiddenError } from '@/lib/utils/error-handler';
import { handleError } from '@/lib/utils/error-handler';
import { connectDB } from '@/lib/database/connection';
import { z } from 'zod';

/**
 * Bulk Create Schema
 */
const bulkCreateTransactionsSchema = z.object({
  transactions: z
    .array(createTransactionSchema)
    .min(1, 'At least one transaction is required')
    .max(100, 'Cannot create more than 100 transactions at once'),
});

/**
 * POST /api/v1/transactions/bulk
 * Create multiple transactions for the authenticated user
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

    // Validate bulk request structure
    const bulkValidationResult = bulkCreateTransactionsSchema.safeParse(body);

    if (!bulkValidationResult.success) {
      const errors = bulkValidationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid bulk transaction request',
          details: errors,
        },
        400
      );
    }

    const { transactions: transactionsData } = bulkValidationResult.data;

    // Validate each transaction
    const validationResults = transactionsData.map((transactionData, index) => {
      const result = createTransactionSchema.safeParse(transactionData);
      return {
        index,
        valid: result.success,
        data: result.success ? result.data : null,
        errors: result.success
          ? null
          : result.error.issues.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
      };
    });

    // Check if all transactions are valid
    const invalidTransactions = validationResults.filter((r) => !r.valid);

    if (invalidTransactions.length > 0) {
      return errorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: `${invalidTransactions.length} transaction(s) failed validation`,
          details: invalidTransactions.map((invalid) => ({
            index: invalid.index,
            errors: invalid.errors,
          })),
        },
        400
      );
    }

    // Create all transactions
    const results = await Promise.allSettled(
      validationResults.map((result) =>
        createTransaction(user._id, result.data!)
      )
    );

    // Separate successful and failed transactions
    const successful: any[] = [];
    const failed: any[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push({
          index,
          transaction: result.value.transaction,
        });
      } else {
        failed.push({
          index,
          error: result.reason?.message || 'Unknown error occurred',
        });
      }
    });

    // If all failed, return error
    if (successful.length === 0) {
      return errorResponse(
        {
          code: 'BULK_CREATE_FAILED',
          message: 'All transactions failed to create',
          details: failed,
        },
        400
      );
    }

    // Return results
    const responseData: any = {
      created: successful.length,
      failed: failed.length,
      total: transactionsData.length,
      transactions: successful.map((s) => s.transaction),
    };

    if (failed.length > 0) {
      responseData.failures = failed;
    }

    return successResponse(
      responseData,
      `Successfully created ${successful.length} of ${transactionsData.length} transaction(s)`,
      failed.length > 0 ? 207 : 201 // 207 Multi-Status if partial success
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
    console.error('Bulk create transactions error:', error);
    return handleError(error);
  }
});
