/**
 * Authentication Redux Slice
 * Handles authentication state, login, logout, and token management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/user.types';
import type { UpdateProfileInput } from '@/lib/validators/user.validator';
import type { ChangePasswordInput } from '@/lib/validators/auth.validator';

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message?: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  currency?: string;
  timezone?: string;
}

/**
 * Async thunk for user login
 */
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Login failed. Please check your credentials.'
        );
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('accessToken', data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
      }

      return {
        user: data.data.user,
        token: data.data.token,
        refreshToken: data.data.refreshToken || null,
        message: data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for user registration
 */
export const registerUser = createAsyncThunk<
  LoginResponse,
  RegistrationData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Registration failed';
        return rejectWithValue(errorMessage);
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('accessToken', data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
      }

      return {
        user: data.data.user,
        token: data.data.token,
        refreshToken: data.data.refreshToken || null,
        message: data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for fetching user profile
 */
export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch user profile'
        );
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for updating user profile
 */
export const updateUserProfile = createAsyncThunk<
  User,
  UpdateProfileInput,
  { rejectValue: string }
>(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to update profile';
        return rejectWithValue(errorMessage);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for changing user password
 */
export const changePassword = createAsyncThunk<
  void,
  ChangePasswordInput,
  { rejectValue: string }
>(
  'auth/changePassword',
  async (passwordData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to change password';
        return rejectWithValue(errorMessage);
      }

      return undefined;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Authentication slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication state from persisted storage
     */
    setAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    /**
     * Logout user and clear state
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Update user data
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile';
      });

        // Update user profile
        builder
          .addCase(updateUserProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
          })
          .addCase(updateUserProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Failed to update profile';
          });

        // Change password
        builder
          .addCase(changePassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(changePassword.fulfilled, (state) => {
            state.isLoading = false;
            state.error = null;
          })
          .addCase(changePassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Failed to change password';
          });
      },
    });

export const { setAuth, logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

