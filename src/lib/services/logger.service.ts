/**
 * Logger Service
 * Winston logger service with structured logging methods
 */

import logger from '@/lib/config/logger.config';

/**
 * Log levels:
 * - error: Error events that might still allow the app to continue
 * - warn: Warning messages for potentially harmful situations
 * - info: Informational messages about general operations
 * - http: HTTP request logging
 * - verbose: More detailed informational messages
 * - debug: Debug messages for development
 * - silly: Very detailed messages for debugging
 */

export interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  [key: string]: any;
}

/**
 * Logger Service
 * Provides structured logging methods for the application
 */
export const loggerService = {
  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
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

    logger.error(logData);
  },

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    logger.warn({
      message,
      ...context,
    });
  },

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    logger.info({
      message,
      ...context,
    });
  },

  /**
   * Log HTTP requests
   */
  http(message: string, context?: LogContext): void {
    logger.http({
      message,
      ...context,
    });
  },

  /**
   * Log verbose messages
   */
  verbose(message: string, context?: LogContext): void {
    logger.verbose({
      message,
      ...context,
    });
  },

  /**
   * Log debug messages
   */
  debug(message: string, context?: LogContext): void {
    logger.debug({
      message,
      ...context,
    });
  },

  /**
   * Log silly messages (very detailed)
   */
  silly(message: string, context?: LogContext): void {
    logger.silly({
      message,
      ...context,
    });
  },

  /**
   * Log API request
   */
  logRequest(method: string, endpoint: string, context?: LogContext): void {
    this.http(`API Request: ${method} ${endpoint}`, {
      method,
      endpoint,
      ...context,
    });
  },

  /**
   * Log API response
   */
  logResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    responseTime: number,
    context?: LogContext
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger[level]({
      message: `API Response: ${method} ${endpoint} - ${statusCode}`,
      method,
      endpoint,
      statusCode,
      responseTime,
      ...context,
    });
  },

  /**
   * Log database operation
   */
  logDatabase(operation: string, collection: string, context?: LogContext): void {
    this.info(`Database Operation: ${operation} on ${collection}`, {
      operation,
      collection,
      ...context,
    });
  },

  /**
   * Log authentication event
   */
  logAuth(event: string, userId?: string, context?: LogContext): void {
    this.info(`Auth Event: ${event}`, {
      event,
      userId,
      ...context,
    });
  },

  /**
   * Log user action
   */
  logUserAction(action: string, userId: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      action,
      userId,
      ...context,
    });
  },
};

// Export default logger instance as well
export default loggerService;

