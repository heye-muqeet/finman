/**
 * Authentication Utility Functions
 * Helper functions for authentication operations
 */

import { verifyToken } from '@/lib/utils/jwt';
import { getUserById } from '@/lib/services/auth.service';
import type { JWTPayload } from '@/lib/utils/jwt';

/**
 * Extract token from Authorization header
 * Supports both "Bearer <token>" and "<token>" formats
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  // Remove "Bearer " prefix if present
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : authHeader.trim();

  return token || null;
}

/**
 * Get token from request headers
 * @param headers - Request headers
 * @returns Token string or null
 */
export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization');
  return extractTokenFromHeader(authHeader);
}

/**
 * Verify token and get user information
 * @param token - JWT token
 * @returns User ID and email from token, or null if invalid
 */
export async function verifyTokenAndGetUser(token: string): Promise<{
  userId: string;
  email: string;
  user: Awaited<ReturnType<typeof getUserById>>;
} | null> {
  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Get user from database
  const user = await getUserById(payload.sub);
  if (!user) {
    return null;
  }

  return {
    userId: payload.sub,
    email: payload.email,
    user,
  };
}

/**
 * Check if a token is valid (not expired and properly formatted)
 * @param token - JWT token
 * @returns True if token is valid, false otherwise
 */
export function isTokenValid(token: string): boolean {
  const payload = verifyToken(token);
  return payload !== null;
}

/**
 * Get user ID from token (without database lookup)
 * @param token - JWT token
 * @returns User ID or null
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = verifyToken(token);
  return payload ? payload.sub : null;
}

/**
 * Get email from token (without database lookup)
 * @param token - JWT token
 * @returns Email or null
 */
export function getEmailFromToken(token: string): string | null {
  const payload = verifyToken(token);
  return payload ? payload.email : null;
}

