/**
 * Client-Safe Logger Utility
 * Provides logging functionality for client components without Node.js dependencies
 * 
 * Note: This logger only uses console methods to avoid bundling server-only code.
 * For server-side logging, use the loggerService directly in server components/API routes.
 */

/**
 * Check if code is running in browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Client-safe logger that works in browser environment
 * Uses console methods and can be extended with error tracking services
 */
export const clientLogger = {
  /**
   * Log error messages (client-safe)
   * In browser: Uses console.error
   * On server: Uses console.error (server components should use loggerService directly)
   */
  error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const logData: any = {
      message,
      ...context,
    };

    if (error instanceof Error) {
      logData.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      logData.error = error;
    }

    // Always use console in client components (no server dependencies)
    console.error('[Client Logger]', logData);

    // Optionally send to error tracking service (e.g., Sentry) in production
    if (isBrowser && process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service
      // Example: Sentry.captureException(error, { extra: context });
    }
  },

  /**
   * Log warning messages (client-safe)
   */
  warn(message: string, context?: Record<string, any>): void {
    console.warn('[Client Logger]', { message, ...context });
  },

  /**
   * Log info messages (client-safe)
   */
  info(message: string, context?: Record<string, any>): void {
    console.info('[Client Logger]', { message, ...context });
  },
};

