/**
 * Application configuration
 * Centralized configuration management
 */

export const appConfig = {
  name: process.env.APP_NAME || 'FinMan',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Feature flags
  features: {
    ai: process.env.FEATURE_AI_ENABLED === 'true',
    email: process.env.FEATURE_EMAIL_ENABLED === 'true',
    oauth: process.env.FEATURE_OAUTH_ENABLED === 'true',
    twoFactor: process.env.FEATURE_2FA_ENABLED === 'true',
  },
  
  // File upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf').split(','),
    folder: process.env.UPLOAD_FOLDER || 'finman/receipts',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  // Internationalization
  i18n: {
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en').split(','),
    defaultTimezone: process.env.DEFAULT_TIMEZONE || 'UTC',
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'USD',
  },
} as const;

