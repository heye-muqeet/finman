/**
 * Error Message Component
 * Reusable component for displaying form validation errors
 */

import { cn } from '@/lib/utils/cn';
import { getFieldError, getNestedFieldError } from '@/lib/utils/form-errors';
import type { FieldErrors } from 'react-hook-form';

/**
 * Error Message Props
 */
export interface ErrorMessageProps {
  /**
   * Form errors object from react-hook-form
   */
  errors: FieldErrors<any>;
  /**
   * Field name or nested field path (e.g., 'email' or 'preferences.theme')
   */
  name: string;
  /**
   * Optional custom className
   */
  className?: string;
  /**
   * Optional custom error message (overrides form error)
   */
  message?: string;
}

/**
 * Error Message Component
 * Displays validation error for a form field
 */
export function ErrorMessage({ errors, name, className, message }: ErrorMessageProps) {
  // Use custom message if provided
  if (message) {
    return (
      <p className={cn('text-sm text-destructive mt-1', className)}>
        {message}
      </p>
    );
  }

  // Try nested field first (e.g., 'preferences.theme')
  const errorMessage = name.includes('.')
    ? getNestedFieldError(errors, name)
    : getFieldError(errors, name);

  if (!errorMessage) return null;

  return (
    <p className={cn('text-sm text-destructive mt-1', className)}>
      {errorMessage}
    </p>
  );
}

