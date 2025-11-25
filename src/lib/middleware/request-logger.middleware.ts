/**
 * Request/Response Logging Middleware
 * Logs all API requests and responses for monitoring and debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import { loggerService } from '@/lib/services/logger.service';

/**
 * Generate a unique request ID for tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  return (
    forwardedFor?.split(',')[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    'unknown'
  );
}

/**
 * Get user agent from request
 */
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Sanitize sensitive data from request body
 */
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'authorization',
    'creditCard',
    'cvv',
    'ssn',
  ];

  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Log request details
 */
export function logRequest(
  request: NextRequest,
  requestId: string,
  userId?: string
): void {
  const method = request.method;
  const url = request.nextUrl.pathname;
  const query = Object.fromEntries(request.nextUrl.searchParams);
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const contentType = request.headers.get('content-type') || 'unknown';

  // Get request body if available (for POST, PUT, PATCH)
  let body: any = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    // Note: In Next.js, we can't easily read the body here without cloning
    // This is a limitation - body will be logged in the route handler if needed
    body = '[Body available in route handler]';
  }

  loggerService.http('API Request', {
    requestId,
    method,
    url,
    query: Object.keys(query).length > 0 ? query : undefined,
    ip,
    userAgent,
    contentType,
    userId: userId || 'anonymous',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log response details
 */
export function logResponse(
  request: NextRequest,
  response: NextResponse,
  requestId: string,
  startTime: number,
  userId?: string
): void {
  const method = request.method;
  const url = request.nextUrl.pathname;
  const statusCode = response.status;
  const responseTime = Date.now() - startTime;
  const contentType = response.headers.get('content-type') || 'unknown';

  // Determine log level based on status code
  const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'http';

  loggerService[logLevel]('API Response', {
    requestId,
    method,
    url,
    statusCode,
    responseTime: `${responseTime}ms`,
    contentType,
    userId: userId || 'anonymous',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Request/Response logging middleware wrapper
 * Wraps an API route handler to automatically log requests and responses
 */
export function withRequestLogging<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options: {
    logRequestBody?: boolean;
    logResponseBody?: boolean;
    excludePaths?: string[];
  } = {}
): T {
  const {
    logRequestBody = false,
    logResponseBody = false,
    excludePaths = [],
  } = options;

  return (async (...args: Parameters<T>): Promise<NextResponse> => {
    const request = args[0] as NextRequest;
    const url = request.nextUrl.pathname;

    // Skip logging for excluded paths
    if (excludePaths.some((path) => url.includes(path))) {
      return handler(...args);
    }

    const requestId = generateRequestId();
    const startTime = Date.now();

    // Extract user ID from context if available (from withAuth middleware)
    let userId: string | undefined;
    if (args.length > 1 && typeof args[1] === 'object' && args[1]?.user) {
      userId = args[1].user._id || args[1].user.id;
    }

    // Log request
    logRequest(request, requestId, userId);

    try {
      // Execute handler
      const response = await handler(...args);

      // Log response
      logResponse(request, response, requestId, startTime, userId);

      // Add request ID to response headers for tracking
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

      return response;
    } catch (error) {
      // Log error
      const responseTime = Date.now() - startTime;
      loggerService.error('API Request Error', error as Error, {
        requestId,
        method: request.method,
        url: request.nextUrl.pathname,
        responseTime: `${responseTime}ms`,
        userId: userId || 'anonymous',
      });

      // Re-throw error to be handled by error handler
      throw error;
    }
  }) as T;
}

/**
 * Standalone request logging middleware function
 * Can be called directly in route handlers
 */
export async function requestLogger(
  request: NextRequest,
  userId?: string
): Promise<string> {
  const requestId = generateRequestId();
  logRequest(request, requestId, userId);
  return requestId;
}

