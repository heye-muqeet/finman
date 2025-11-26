/**
 * Toaster Component
 * Toast notification provider using Redux
 */

'use client';

import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from '@/components/ui/toast';
import { removeToast } from '@/lib/store/slices/toastSlice';
import type { RootState } from '@/lib/store';

/**
 * Toaster Component
 * Renders toast notifications from Redux state
 */
export function Toaster() {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  const handleRemove = (id: string) => {
    dispatch(removeToast(id));
  };

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />;
}

