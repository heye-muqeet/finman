/**
 * Form Error Utilities
 * Utilities for handling and formatting form validation errors
 */

import { FieldErrors, FieldError } from 'react-hook-form';
import { ZodError } from 'zod';

/**
 * Get error message for a specific field
 * @param errors - Form errors object from react-hook-form
 * @param fieldName - Name of the field to get error for
 * @returns Error message string or undefined
 */
export function getFieldError<T extends Record<string, any>>(
  errors: FieldErrors<T>,
  fieldName: keyof T | string
): string | undefined {
  const field = errors[fieldName as keyof T];
  if (!field) return undefined;
  
  if (typeof field === 'object' && 'message' in field) {
    return field.message as string;
  }
  
  return undefined;
}

/**
 * Get nested field error (e.g., 'preferences.theme')
 * @param errors - Form errors object from react-hook-form
 * @param fieldPath - Dot-separated path to the field (e.g., 'preferences.theme')
 * @returns Error message string or undefined
 */
export function getNestedFieldError<T extends Record<string, any>>(
  errors: FieldErrors<T>,
  fieldPath: string
): string | undefined {
  const parts = fieldPath.split('.');
  let current: any = errors;
  
  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[part];
  }
  
  if (current && typeof current === 'object' && 'message' in current) {
    return current.message as string;
  }
  
  return undefined;
}

/**
 * Check if a field has an error
 * @param errors - Form errors object from react-hook-form
 * @param fieldName - Name of the field to check
 * @returns True if field has an error
 */
export function hasFieldError<T extends Record<string, any>>(
  errors: FieldErrors<T>,
  fieldName: keyof T | string
): boolean {
  return getFieldError(errors, fieldName) !== undefined;
}

/**
 * Get all error messages as an array
 * @param errors - Form errors object from react-hook-form
 * @returns Array of error messages
 */
export function getAllErrors<T extends Record<string, any>>(
  errors: FieldErrors<T>
): string[] {
  const errorMessages: string[] = [];
  
  const collectErrors = (errs: any, prefix = ''): void => {
    if (!errs || typeof errs !== 'object') return;
    
    Object.keys(errs).forEach((key) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      const field = errs[key];
      
      if (field && typeof field === 'object') {
        if ('message' in field && typeof field.message === 'string') {
          errorMessages.push(field.message);
        } else {
          // Recursively check nested errors
          collectErrors(field, fieldPath);
        }
      }
    });
  };
  
  collectErrors(errors);
  return errorMessages;
}

/**
 * Get first error message
 * @param errors - Form errors object from react-hook-form
 * @returns First error message or undefined
 */
export function getFirstError<T extends Record<string, any>>(
  errors: FieldErrors<T>
): string | undefined {
  const allErrors = getAllErrors(errors);
  return allErrors.length > 0 ? allErrors[0] : undefined;
}

/**
 * Format Zod error to user-friendly message
 * @param error - Zod error
 * @returns Formatted error message
 */
export function formatZodError(error: ZodError): string {
  if (error.errors.length === 0) {
    return 'Validation failed';
  }
  
  const firstError = error.errors[0];
  const path = firstError.path.join('.');
  const message = firstError.message;
  
  return path ? `${path}: ${message}` : message;
}

/**
 * Convert Zod error to FieldErrors format
 * @param error - Zod error
 * @returns FieldErrors object compatible with react-hook-form
 */
export function zodErrorToFieldErrors<T extends Record<string, any>>(
  error: ZodError
): FieldErrors<T> {
  const fieldErrors: any = {};
  
  error.errors.forEach((err) => {
    const path = err.path;
    if (path.length === 0) return;
    
    let current = fieldErrors;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i] as string;
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const lastKey = path[path.length - 1] as string;
    current[lastKey] = {
      type: err.code,
      message: err.message,
    };
  });
  
  return fieldErrors as FieldErrors<T>;
}

/**
 * Get user-friendly error message
 * Maps common validation error codes to user-friendly messages
 * @param error - Field error from react-hook-form
 * @returns User-friendly error message
 */
export function getUserFriendlyError(error: FieldError | undefined): string | undefined {
  if (!error) return undefined;
  
  // If message exists, use it
  if (error.message) {
    return error.message;
  }
  
  // Map common error types to user-friendly messages
  const errorTypeMap: Record<string, string> = {
    required: 'This field is required',
    min: 'Value is too small',
    max: 'Value is too large',
    minLength: 'Text is too short',
    maxLength: 'Text is too long',
    pattern: 'Invalid format',
    email: 'Invalid email address',
    url: 'Invalid URL',
    date: 'Invalid date',
    number: 'Must be a number',
    positive: 'Must be a positive number',
    integer: 'Must be a whole number',
  };
  
  return errorTypeMap[error.type || ''] || 'Invalid value';
}

/**
 * Check if form has any errors
 * @param errors - Form errors object from react-hook-form
 * @returns True if form has any errors
 */
export function hasFormErrors<T extends Record<string, any>>(
  errors: FieldErrors<T>
): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get error count
 * @param errors - Form errors object from react-hook-form
 * @returns Number of errors
 */
export function getErrorCount<T extends Record<string, any>>(
  errors: FieldErrors<T>
): number {
  return getAllErrors(errors).length;
}

