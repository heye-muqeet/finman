/**
 * Toast Hook
 * Hook for managing toast notifications using Redux
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToast, removeToast } from '@/lib/store/slices/toastSlice';
import type { RootState } from '@/lib/store';
import type { ToastVariant } from '@/components/ui/toast';

/**
 * Toast input interface
 */
export interface ToastInput {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

/**
 * useToast Hook
 * Provides methods to show and manage toast notifications
 */
export function useToast() {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  const toast = useCallback(
    (props: ToastInput) => {
      dispatch(addToast(props));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      dispatch(addToast({ title, description, variant: 'success' }));
    },
    [dispatch]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      dispatch(addToast({ title, description, variant: 'error' }));
    },
    [dispatch]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      dispatch(addToast({ title, description, variant: 'warning' }));
    },
    [dispatch]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      dispatch(addToast({ title, description, variant: 'info' }));
    },
    [dispatch]
  );

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    removeToast: remove,
  };
}

