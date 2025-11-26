/**
 * Budgets Redux Slice
 * Handles budget state management and API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Budget,
  BudgetCreateInput,
  BudgetUpdateInput,
  BudgetPeriod,
  BudgetProgress,
  BudgetProgressResponse,
} from '@/types/budget.types';

/**
 * Budgets state interface
 */
export interface BudgetsState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  selectedBudgetProgress: BudgetProgress | null;
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
 * Initial budgets state
 */
const initialState: BudgetsState = {
  budgets: [],
  selectedBudget: null,
  selectedBudgetProgress: null,
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
 * Fetch budgets parameters
 */
export interface FetchBudgetsParams {
  isActive?: boolean;
  period?: BudgetPeriod;
  categoryId?: string;
}

/**
 * Async thunk for fetching budgets
 */
export const fetchBudgets = createAsyncThunk<
  { budgets: Budget[]; total: number },
  FetchBudgetsParams | void,
  { rejectValue: string }
>(
  'budgets/fetchBudgets',
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
      if (params?.isActive !== undefined) {
        queryParams.append('isActive', params.isActive.toString());
      }
      if (params?.period) {
        queryParams.append('period', params.period);
      }
      if (params?.categoryId) {
        queryParams.append('categoryId', params.categoryId);
      }
      const queryString = queryParams.toString();
      const url = `${baseUrl}/api/v1/budgets${queryString ? `?${queryString}` : ''}`;

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
          data.error?.message || 'Failed to fetch budgets'
        );
      }

      return {
        budgets: data.data.budgets || [],
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
 * Async thunk for creating a budget
 */
export const createBudget = createAsyncThunk<
  Budget,
  BudgetCreateInput,
  { rejectValue: string }
>(
  'budgets/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(budgetData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to create budget';
        return rejectWithValue(errorMessage);
      }

      return data.data.budget;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for getting a budget by ID
 */
export const getBudgetById = createAsyncThunk<
  Budget,
  string,
  { rejectValue: string }
>(
  'budgets/getBudgetById',
  async (budgetId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/budgets/${budgetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch budget'
        );
      }

      return data.data.budget;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for updating a budget
 */
export const updateBudget = createAsyncThunk<
  Budget,
  { budgetId: string; data: BudgetUpdateInput },
  { rejectValue: string }
>(
  'budgets/updateBudget',
  async ({ budgetId, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/budgets/${budgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error?.message || responseData.error?.details || 'Failed to update budget';
        return rejectWithValue(errorMessage);
      }

      return responseData.data.budget;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for deleting a budget
 */
export const deleteBudget = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'budgets/deleteBudget',
  async (budgetId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to delete budget'
        );
      }

      return budgetId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for getting budget progress
 */
export const getBudgetProgress = createAsyncThunk<
  BudgetProgressResponse,
  string,
  { rejectValue: string }
>(
  'budgets/getBudgetProgress',
  async (budgetId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/budgets/${budgetId}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch budget progress'
        );
      }

      return {
        budget: data.data.budget,
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
 * Budgets slice
 */
const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    /**
     * Set selected budget
     */
    setSelectedBudget: (state, action: PayloadAction<Budget | null>) => {
      state.selectedBudget = action.payload;
      // Clear progress when budget changes
      if (!action.payload) {
        state.selectedBudgetProgress = null;
      }
    },
    /**
     * Clear selected budget
     */
    clearSelectedBudget: (state) => {
      state.selectedBudget = null;
      state.selectedBudgetProgress = null;
    },
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Reset budgets state
     */
    resetBudgets: (state) => {
      state.budgets = [];
      state.selectedBudget = null;
      state.selectedBudgetProgress = null;
      state.total = 0;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload.budgets;
        state.total = action.payload.total;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch budgets';
      });

    // Create budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isCreating = false;
        state.budgets.push(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create budget';
      });

    // Get budget by ID
    builder
      .addCase(getBudgetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBudgetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBudget = action.payload;
        // Update budget in list if it exists
        const index = state.budgets.findIndex((budget) => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(getBudgetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch budget';
      });

    // Update budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.budgets.findIndex((budget) => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        // Update selected budget if it's the one being updated
        if (state.selectedBudget?._id === action.payload._id) {
          state.selectedBudget = action.payload;
          // Clear progress as it may be outdated
          state.selectedBudgetProgress = null;
        }
        state.error = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update budget';
      });

    // Delete budget
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.budgets = state.budgets.filter((budget) => budget._id !== action.payload);
        state.total -= 1;
        // Clear selected budget if it was deleted
        if (state.selectedBudget?._id === action.payload) {
          state.selectedBudget = null;
          state.selectedBudgetProgress = null;
        }
        state.error = null;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete budget';
      });

    // Get budget progress
    builder
      .addCase(getBudgetProgress.pending, (state) => {
        state.isFetchingProgress = true;
        state.error = null;
      })
      .addCase(getBudgetProgress.fulfilled, (state, action) => {
        state.isFetchingProgress = false;
        state.selectedBudgetProgress = action.payload.progress;
        // Update budget if it's the selected one
        if (state.selectedBudget?._id === action.payload.budget._id) {
          state.selectedBudget = action.payload.budget;
        }
        // Update budget in list if it exists
        const index = state.budgets.findIndex((budget) => budget._id === action.payload.budget._id);
        if (index !== -1) {
          state.budgets[index] = action.payload.budget;
        }
        state.error = null;
      })
      .addCase(getBudgetProgress.rejected, (state, action) => {
        state.isFetchingProgress = false;
        state.error = action.payload || 'Failed to fetch budget progress';
      });
  },
});

export const {
  setSelectedBudget,
  clearSelectedBudget,
  clearError,
  resetBudgets,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;

