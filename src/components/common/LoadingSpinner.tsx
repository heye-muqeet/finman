/**
 * Loading Spinner Component
 * Reusable loading spinner for various use cases
 */

import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Show text below spinner
   */
  text?: string;
  
  /**
   * Full screen overlay
   */
  fullScreen?: boolean;
  
  /**
   * Inline spinner (no wrapper)
   */
  inline?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export default function LoadingSpinner({
  size = 'md',
  className,
  text,
  fullScreen = false,
  inline = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )}
    />
  );

  if (inline) {
    return spinner;
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && (
            <p className="text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {spinner}
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

