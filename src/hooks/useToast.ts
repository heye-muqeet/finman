/**
 * Toast Hook
 * Hook for managing toast notifications
 */

import { useState, useCallback } from 'react';
import type { ToastProps, ToastVariant } from '@/components/ui/toast';

export interface Toast extends ToastProps {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (props: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { ...props, id };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'success' });
    },
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'error' });
    },
    [toast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'warning' });
    },
    [toast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'info' });
    },
    [toast]
  );

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}

