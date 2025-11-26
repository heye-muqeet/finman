import { NextResponse } from 'next/server';
import { errorResponse } from './api-response';

/**
 * Custom error classes for better error handling
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(404, `${resource} not found${id ? ` with id: ${id}` : ''}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

/**
 * Standardized error response handler
 * Uses the standardized API response format
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return errorResponse(
      {
        code: error.code || 'ERROR',
        message: error.message,
        details: error.details,
      },
      error.statusCode
    );
  }

  // Unknown error
  return errorResponse(
    {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    500
  );
}

