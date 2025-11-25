/**
 * User Redux Slice
 * Handles user profile and preferences state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, UserPreferences } from '@/types/user.types';

/**
 * User state interface
 */
export interface UserState {
  profile: User | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial user state
 */
const initialState: UserState = {
  profile: null,
  preferences: null,
  isLoading: false,
  error: null,
};

/**
 * User slice
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Set user profile
     */
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.preferences = action.payload.preferences;
      state.error = null;
    },
    /**
     * Update user profile
     */
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        if (action.payload.preferences) {
          state.preferences = { ...state.profile.preferences, ...action.payload.preferences };
        }
      }
    },
    /**
     * Update user preferences
     */
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
        if (state.profile) {
          state.profile.preferences = state.preferences;
        }
      }
    },
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Set error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    /**
     * Clear user state
     */
    clearUser: (state) => {
      state.profile = null;
      state.preferences = null;
      state.error = null;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  updatePreferences,
  setLoading,
  setError,
  clearUser,
} = userSlice.actions;
export default userSlice.reducer;

