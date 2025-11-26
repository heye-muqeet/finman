/**
 * Toast Component
 * Simple toast notification component
 */

'use client';

import * as React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, variant = 'default', duration = 5000, onClose }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300); // Wait for animation
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    if (!isVisible) return null;

    const icons = {
      success: CheckCircle2,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
      default: Info,
    };

    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[swipe=end]:animate-out data-[swipe=cancel]:translate-x-0',
          {
            'bg-background border-border': variant === 'default',
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800':
              variant === 'success',
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800':
              variant === 'error',
            'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800':
              variant === 'warning',
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800':
              variant === 'info',
          }
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <Icon
                className={cn('h-5 w-5', {
                  'text-foreground': variant === 'default',
                  'text-green-600 dark:text-green-400': variant === 'success',
                  'text-red-600 dark:text-red-400': variant === 'error',
                  'text-yellow-600 dark:text-yellow-400': variant === 'warning',
                  'text-blue-600 dark:text-blue-400': variant === 'info',
                })}
              />
            </div>
            <div className="ml-3 w-0 flex-1">
              {title && (
                <p
                  className={cn('text-sm font-medium', {
                    'text-foreground': variant === 'default',
                    'text-green-800 dark:text-green-200': variant === 'success',
                    'text-red-800 dark:text-red-200': variant === 'error',
                    'text-yellow-800 dark:text-yellow-200': variant === 'warning',
                    'text-blue-800 dark:text-blue-200': variant === 'info',
                  })}
                >
                  {title}
                </p>
              )}
              {description && (
                <p
                  className={cn('mt-1 text-sm', {
                    'text-muted-foreground': variant === 'default',
                    'text-green-700 dark:text-green-300': variant === 'success',
                    'text-red-700 dark:text-red-300': variant === 'error',
                    'text-yellow-700 dark:text-yellow-300': variant === 'warning',
                    'text-blue-700 dark:text-blue-300': variant === 'info',
                  })}
                >
                  {description}
                </p>
              )}
            </div>
            {onClose && (
              <div className="ml-4 shrink-0 flex">
                <button
                  type="button"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose?.(), 300);
                  }}
                  className={cn(
                    'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                    {
                      'text-foreground hover:text-muted-foreground focus:ring-foreground':
                        variant === 'default',
                      'text-green-600 hover:text-green-700 focus:ring-green-500':
                        variant === 'success',
                      'text-red-600 hover:text-red-700 focus:ring-red-500':
                        variant === 'error',
                      'text-yellow-600 hover:text-yellow-700 focus:ring-yellow-500':
                        variant === 'warning',
                      'text-blue-600 hover:text-blue-700 focus:ring-blue-500':
                        variant === 'info',
                    }
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
Toast.displayName = 'Toast';

export { Toast };

/**
 * Toast Container Component
 * Container for managing multiple toasts
 */
export interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-0 z-100 flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-auto sm:right-0 sm:top-0 sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

