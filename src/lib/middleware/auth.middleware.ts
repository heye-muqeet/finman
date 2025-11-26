/**
 * Authentication Middleware
 * Middleware to verify JWT tokens and protect API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeaders, verifyTokenAndGetUser } from '@/lib/utils/auth';
import { errorResponse } from '@/lib/utils/api-response';
import { UnauthorizedError } from '@/lib/utils/error-handler';
import { logRequest, logResponse } from '@/lib/middleware/request-logger.middleware';

/**
 * Request with authenticated user attached
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Authentication middleware result
 */
export interface AuthMiddlewareResult {
  success: boolean;
  response?: NextResponse;
  user?: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 * @param request - Next.js request object
 * @returns Middleware result with user or error response
 */
export async function authenticate(
  request: NextRequest
): Promise<AuthMiddlewareResult> {
  try {
    // Get token from Authorization header
    const token = getTokenFromHeaders(request.headers);

    if (!token) {
      return {
        success: false,
        response: errorResponse(
          {
            code: 'UNAUTHORIZED',
            message: 'No authentication token provided',
          },
          401
        ),
      };
    }

    // Verify token and get user
    const tokenData = await verifyTokenAndGetUser(token);

    if (!tokenData || !tokenData.user) {
      return {
        success: false,
        response: errorResponse(
          {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired authentication token',
          },
          401
        ),
      };
    }

    // Attach user to request context
    const user = {
      _id: tokenData.user._id.toString(),
      email: tokenData.user.email,
      firstName: tokenData.user.firstName || undefined,
      lastName: tokenData.user.lastName || undefined,
    };

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return {
      success: false,
      response: errorResponse(
        {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication failed',
        },
        401
      ),
    };
  }
}

/**
 * Higher-order function to protect API routes
 * Wraps a route handler with authentication middleware and request logging
 * @param handler - Route handler function
 * @returns Protected route handler with logging
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: { user: { _id: string; email: string; firstName?: string; lastName?: string } }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Authenticate request
    const authResult = await authenticate(request);

    if (!authResult.success || !authResult.user) {
      // Log failed authentication attempt
      logRequest(request, requestId);
      logResponse(request, authResult.response || errorResponse(
        {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        401
      ), requestId, startTime);
      
      // Return error response from middleware
      return authResult.response || errorResponse(
        {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        401
      );
    }

    // Log authenticated request
    logRequest(request, requestId, authResult.user._id);

    try {
      // Call the handler with authenticated user
      const response = await handler(request, { user: authResult.user });
      
      // Log successful response
      logResponse(request, response, requestId, startTime, authResult.user._id);
      
      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
      
      return response;
    } catch (error) {
      // Log error response
      const errorResponseObj = errorResponse(
        {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
        500
      );
      logResponse(request, errorResponseObj, requestId, startTime, authResult.user._id);
      errorResponseObj.headers.set('X-Request-ID', requestId);
      errorResponseObj.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
      return errorResponseObj;
    }
  };
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 * @param request - Next.js request object
 * @returns User object if authenticated, null otherwise
 */
export async function optionalAuth(
  request: NextRequest
): Promise<{ _id: string; email: string; firstName?: string; lastName?: string } | null> {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token) {
      return null;
    }

    const tokenData = await verifyTokenAndGetUser(token);
    if (!tokenData || !tokenData.user) {
      return null;
    }

    return {
      _id: tokenData.user._id.toString(),
      email: tokenData.user.email,
      firstName: tokenData.user.firstName || undefined,
      lastName: tokenData.user.lastName || undefined,
    };
  } catch (error) {
    return null;
  }
}

