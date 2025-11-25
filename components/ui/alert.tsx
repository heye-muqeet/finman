/**
 * Alert Component
 * Styled alert component for displaying messages
 */

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border p-4',
          {
            'bg-background text-foreground border-border': variant === 'default',
            'border-red-500/50 text-red-900 dark:text-red-200 bg-red-50 dark:bg-red-900/20':
              variant === 'destructive',
            'border-green-500/50 text-green-900 dark:text-green-200 bg-green-50 dark:bg-green-900/20':
              variant === 'success',
            'border-yellow-500/50 text-yellow-900 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/20':
              variant === 'warning',
            'border-blue-500/50 text-blue-900 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20':
              variant === 'info',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };

