/**
 * Toast Redux Slice
 * Handles toast notification state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ToastVariant } from '@/components/ui/toast';

/**
 * Toast interface
 */
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

/**
 * Toast state interface
 */
export interface ToastState {
  toasts: Toast[];
}

/**
 * Initial toast state
 */
const initialState: ToastState = {
  toasts: [],
};

/**
 * Toast slice
 */
const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    /**
     * Add a toast
     */
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const newToast: Toast = {
        ...action.payload,
        id,
        duration: action.payload.duration ?? 5000,
      };
      state.toasts.push(newToast);
    },
    /**
     * Remove a toast by ID
     */
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    /**
     * Clear all toasts
     */
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;

