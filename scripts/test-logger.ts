/**
 * Logger Test Script
 * Test script to verify Winston logger is working correctly
 */

import { loggerService } from '@/lib/services/logger.service';

console.log('Testing Winston Logger Service...\n');

// Test different log levels
loggerService.error('Test error message', new Error('Test error'), {
  userId: 'test-user-123',
  requestId: 'req-456',
});

loggerService.warn('Test warning message', {
  userId: 'test-user-123',
  endpoint: '/api/test',
});

loggerService.info('Test info message', {
  userId: 'test-user-123',
  operation: 'test-operation',
});

loggerService.http('Test HTTP message', {
  method: 'GET',
  endpoint: '/api/test',
  statusCode: 200,
  responseTime: 123,
});

loggerService.verbose('Test verbose message', {
  debug: true,
});

loggerService.debug('Test debug message', {
  debugInfo: 'some debug data',
});

loggerService.silly('Test silly message', {
  veryDetailed: true,
});

// Test specific methods
loggerService.logRequest('POST', '/api/v1/auth/login', {
  userId: 'test-user-123',
  ip: '127.0.0.1',
});

loggerService.logResponse('POST', '/api/v1/auth/login', 200, 150, {
  userId: 'test-user-123',
});

loggerService.logDatabase('find', 'users', {
  query: { email: 'test@example.com' },
});

loggerService.logAuth('login', 'test-user-123', {
  method: 'email',
  ip: '127.0.0.1',
});

loggerService.logUserAction('update_profile', 'test-user-123', {
  fields: ['firstName', 'lastName'],
});

console.log('\n✅ Logger test completed! Check logs/ directory for log files.');

