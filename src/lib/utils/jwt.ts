/**
 * JWT Token Utilities
 * Provides functions for generating and verifying JWT tokens
 */

import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT access token
 * @param userId - User ID
 * @param email - User email
 * @returns JWT token string
 */
export function generateAccessToken(userId: string, email: string): string {
  const payload: JWTPayload = {
    sub: userId,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Generate JWT refresh token
 * @param userId - User ID
 * @param email - User email
 * @returns JWT refresh token string
 */
export function generateRefreshToken(userId: string, email: string): string {
  const payload: JWTPayload = {
    sub: userId,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', error.expiredAt);
      return null;
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error.message);
      return null;
    } else {
      console.error('Token verification error:', error);
      return null;
    }
  }
}

/**
 * Decode JWT token without verification (for debugging)
 * @param token - JWT token to decode
 * @returns Decoded token payload or null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Get token expiration date
 * @param token - JWT token
 * @returns Expiration date or null
 */
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
}

/**
 * Check if token is expired
 * @param token - JWT token
 * @returns True if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return true;
  }
  return expiration < new Date();
}

