/**
 * UI Redux Slice
 * Handles UI state like theme, sidebar, modals, etc.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * UI state interface
 */
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
}

/**
 * Initial UI state
 */
const initialState: UIState = {
  theme: 'system',
  sidebarOpen: false,
  isLoading: false,
  notifications: [],
};

/**
 * UI slice
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Set theme
     */
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    /**
     * Toggle sidebar
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    /**
     * Set sidebar open state
     */
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Add notification
     */
    addNotification: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        id?: string;
      }>
    ) => {
      const notification = {
        id: action.payload.id || Date.now().toString(),
        type: action.payload.type,
        message: action.payload.message,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    /**
     * Remove notification
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },
    /**
     * Clear all notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;
export default uiSlice.reducer;

