/**
 * Environment Utilities
 * Centralized environment variable access
 */

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get current environment
 */
export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

