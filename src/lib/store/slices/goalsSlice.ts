/**
 * Goals Redux Slice
 * Handles goal state management and API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Goal,
  GoalCreateInput,
  GoalUpdateInput,
  GoalCategory,
  GoalStatus,
  GoalProgress,
  GoalProgressResponse,
} from '@/types/goal.types';

/**
 * Goals state interface
 */
export interface GoalsState {
  goals: Goal[];
  selectedGoal: Goal | null;
  selectedGoalProgress: GoalProgress | null;
  total: number;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingProgress: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp of last successful fetch
}

/**
 * Initial goals state
 */
const initialState: GoalsState = {
  goals: [],
  selectedGoal: null,
  selectedGoalProgress: null,
  total: 0,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isFetchingProgress: false,
  error: null,
  lastFetched: null,
};

/**
 * Fetch goals parameters
 */
export interface FetchGoalsParams {
  status?: GoalStatus;
  category?: GoalCategory;
  isCompleted?: boolean;
}

/**
 * Async thunk for fetching goals
 */
export const fetchGoals = createAsyncThunk<
  { goals: Goal[]; total: number },
  FetchGoalsParams | void,
  { rejectValue: string }
>(
  'goals/fetchGoals',
  async (params, { rejectWithValue }) => {
    try {
      // Get token from localStorage or state
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      if (params?.category) {
        queryParams.append('category', params.category);
      }
      if (params?.isCompleted !== undefined) {
        queryParams.append('isCompleted', params.isCompleted.toString());
      }
      const queryString = queryParams.toString();
      const url = `${baseUrl}/api/v1/goals${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch goals'
        );
      }

      return {
        goals: data.data.goals || [],
        total: data.data.total || 0,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for creating a goal
 */
export const createGoal = createAsyncThunk<
  Goal,
  GoalCreateInput,
  { rejectValue: string }
>(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to create goal';
        return rejectWithValue(errorMessage);
      }

      return data.data.goal;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for getting a goal by ID
 */
export const getGoalById = createAsyncThunk<
  Goal,
  string,
  { rejectValue: string }
>(
  'goals/getGoalById',
  async (goalId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/goals/${goalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch goal'
        );
      }

      return data.data.goal;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for updating a goal
 */
export const updateGoal = createAsyncThunk<
  Goal,
  { goalId: string; data: GoalUpdateInput },
  { rejectValue: string }
>(
  'goals/updateGoal',
  async ({ goalId, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error?.message || responseData.error?.details || 'Failed to update goal';
        return rejectWithValue(errorMessage);
      }

      return responseData.data.goal;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for deleting a goal
 */
export const deleteGoal = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'goals/deleteGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(
          data.error?.message || 'Failed to delete goal'
        );
      }

      return goalId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for getting goal progress
 */
export const getGoalProgress = createAsyncThunk<
  GoalProgressResponse,
  string,
  { rejectValue: string }
>(
  'goals/getGoalProgress',
  async (goalId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/goals/${goalId}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch goal progress'
        );
      }

      return {
        goal: data.data.goal,
        progress: data.data.progress,
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
 * Goals slice
 */
const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setSelectedGoal: (state, action: PayloadAction<Goal | null>) => {
      state.selectedGoal = action.payload;
      // Clear progress when goal changes (it might be outdated)
      if (action.payload !== state.selectedGoal) {
        state.selectedGoalProgress = null;
      }
    },
    clearSelectedGoal: (state) => {
      state.selectedGoal = null;
      state.selectedGoalProgress = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetGoals: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch goals
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload.goals;
        state.total = action.payload.total;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch goals';
      });

    // Create goal
    builder
      .addCase(createGoal.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isCreating = false;
        state.goals.unshift(action.payload); // Add to beginning
        state.total += 1;
        state.error = null;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create goal';
      });

    // Get goal by ID
    builder
      .addCase(getGoalById.pending, (state) => {
        state.error = null;
      })
      .addCase(getGoalById.fulfilled, (state, action) => {
        state.selectedGoal = action.payload;
        state.error = null;
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch goal';
      });

    // Update goal
    builder
      .addCase(updateGoal.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.goals.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        if (state.selectedGoal?._id === action.payload._id) {
          state.selectedGoal = action.payload;
        }
        // Clear progress as it might be outdated
        state.selectedGoalProgress = null;
        state.error = null;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update goal';
      });

    // Delete goal
    builder
      .addCase(deleteGoal.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isDeleting = false;
        // Remove goal from list (goalId is returned from thunk)
        const goalId = action.payload;
        state.goals = state.goals.filter((g) => g._id !== goalId);
        state.total = Math.max(0, state.total - 1);
        // Clear selected if deleted
        if (state.selectedGoal?._id === goalId) {
          state.selectedGoal = null;
          state.selectedGoalProgress = null;
        }
        state.error = null;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete goal';
      });

    // Get goal progress
    builder
      .addCase(getGoalProgress.pending, (state) => {
        state.isFetchingProgress = true;
        state.error = null;
      })
      .addCase(getGoalProgress.fulfilled, (state, action) => {
        state.isFetchingProgress = false;
        state.selectedGoalProgress = action.payload.progress;
        state.error = null;
      })
      .addCase(getGoalProgress.rejected, (state, action) => {
        state.isFetchingProgress = false;
        state.error = action.payload || 'Failed to fetch goal progress';
      });
  },
});

export const {
  setSelectedGoal,
  clearSelectedGoal,
  clearError,
  resetGoals,
} = goalsSlice.actions;

export default goalsSlice.reducer;

