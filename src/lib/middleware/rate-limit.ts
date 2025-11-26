/**
 * Rate Limiting Middleware
 * Basic rate limiting for API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config/app.config';
import { errorResponse } from '@/lib/utils/api-response';

/**
 * Rate limit store (in-memory for now)
 * In production, consider using Redis or a more robust solution
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries from the rate limit store
 */
function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get client identifier from request
 * Uses IP address by default
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Rate limit configuration interface
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests per window
  message?: string; // Custom error message
  identifier?: (request: NextRequest) => string; // Custom identifier function
}

/**
 * Default rate limit configuration
 */
const defaultConfig: RateLimitConfig = {
  windowMs: appConfig.rateLimit.windowMs, // 15 minutes
  maxRequests: appConfig.rateLimit.maxRequests, // 100 requests
  message: 'Too many requests, please try again later',
};

/**
 * Rate limiting middleware factory
 * Creates a rate limiting middleware function
 */
export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Clean up expired entries periodically
    if (Math.random() < 0.1) {
      // Clean up 10% of the time (to avoid doing it on every request)
      cleanExpiredEntries();
    }

    // Get client identifier
    const identifier =
      finalConfig.identifier?.(request) || getClientIdentifier(request);
    const key = `${identifier}:${request.nextUrl.pathname}`;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    const now = Date.now();

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + finalConfig.windowMs,
      };
      rateLimitStore.set(key, entry);
    }

    // Increment request count
    entry.count += 1;

    // Check if rate limit exceeded
    if (entry.count > finalConfig.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      const response = errorResponse(
        {
          code: 'RATE_LIMIT_EXCEEDED',
          message: finalConfig.message || 'Too many requests, please try again later',
          details: { retryAfter },
        },
        429
      );
      
      // Add rate limit headers
      response.headers.set('Retry-After', retryAfter.toString());
      response.headers.set('X-RateLimit-Limit', finalConfig.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
      
      return response;
    }

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set(
      'X-RateLimit-Limit',
      finalConfig.maxRequests.toString()
    );
    response.headers.set(
      'X-RateLimit-Remaining',
      Math.max(0, finalConfig.maxRequests - entry.count).toString()
    );
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(entry.resetTime).toISOString()
    );

    return null; // Continue to next handler
  };
}

/**
 * Strict rate limit for authentication endpoints
 * More restrictive than default
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes for auth endpoints
  message: 'Too many authentication attempts, please try again later',
});

/**
 * Standard rate limit for general API endpoints
 */
export const standardRateLimit = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  maxRequests: appConfig.rateLimit.maxRequests,
});

