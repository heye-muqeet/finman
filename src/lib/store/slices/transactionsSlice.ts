/**
 * Transactions Redux Slice
 * Handles transaction state management and API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Transaction,
  TransactionCreateInput,
  TransactionUpdateInput,
  TransactionFilters,
  TransactionQueryOptions,
} from '@/types/transaction.types';

/**
 * Transaction Statistics Type
 */
export interface TransactionStats {
  income: {
    total: number;
    count: number;
    average: number;
    min: number;
    max: number;
  };
  expense: {
    total: number;
    count: number;
    average: number;
    min: number;
    max: number;
  };
  net: number;
  totalTransactions: number;
}

/**
 * Transactions state interface
 */
export interface TransactionsState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  // Statistics
  stats: TransactionStats | null;
  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  // Filters
  filters: TransactionFilters;
  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingStats: boolean;
  isBulkCreating: boolean;
  // Error state
  error: string | null;
  // Last fetch timestamp
  lastFetched: number | null;
  // Optimistic updates tracking
  optimisticUpdates: {
    [key: string]: Transaction; // Temporary transactions pending server confirmation
  };
  // Form state management
  formDraft: Partial<TransactionCreateInput> | null; // Draft transaction data
  formValidationErrors: Record<string, string> | null; // Form validation errors
  isFormDirty: boolean; // Whether form has unsaved changes
}

/**
 * Initial transactions state
 */
const initialState: TransactionsState = {
  transactions: [],
  selectedTransaction: null,
  // Statistics
  stats: null,
  // Pagination defaults
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  // Filter defaults
  filters: {},
  // Sorting defaults
  sortBy: 'date',
  sortOrder: 'desc',
  // Loading states
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isFetchingStats: false,
  isBulkCreating: false,
  // Error state
  error: null,
  // Last fetch
  lastFetched: null,
  // Optimistic updates
  optimisticUpdates: {},
  // Form state
  formDraft: null,
  formValidationErrors: null,
  isFormDirty: false,
};

/**
 * Fetch transactions parameters
 */
export interface FetchTransactionsParams extends Partial<TransactionQueryOptions> {
  // Override page/limit if needed
  page?: number;
  limit?: number;
}

/**
 * Async thunk for fetching transactions
 */
export const fetchTransactions = createAsyncThunk<
  {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  },
  FetchTransactionsParams | void,
  { rejectValue: string }
>(
  'transactions/fetchTransactions',
  async (params, { rejectWithValue, getState }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      // Get current state to use existing filters/pagination if params not provided
      const state = getState() as { transactions: TransactionsState };
      const currentState = state.transactions;

      // Use provided params or fall back to current state
      const filters = params?.filters ?? currentState.filters;
      const page = params?.page ?? currentState.page;
      const limit = params?.limit ?? currentState.limit;
      const sortBy = params?.sortBy ?? currentState.sortBy;
      const sortOrder = params?.sortOrder ?? currentState.sortOrder;

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Build query string
      const queryParams = new URLSearchParams();
      
      // Add filters
      if (filters.type) {
        queryParams.append('type', filters.type);
      }
      if (filters.categoryId) {
        queryParams.append('categoryId', filters.categoryId);
      }
      if (filters.minAmount !== undefined) {
        queryParams.append('minAmount', filters.minAmount.toString());
      }
      if (filters.maxAmount !== undefined) {
        queryParams.append('maxAmount', filters.maxAmount.toString());
      }
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate instanceof Date 
          ? filters.startDate.toISOString() 
          : new Date(filters.startDate).toISOString());
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate instanceof Date 
          ? filters.endDate.toISOString() 
          : new Date(filters.endDate).toISOString());
      }
      if (filters.paymentMethod) {
        queryParams.append('paymentMethod', filters.paymentMethod);
      }
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => queryParams.append('tags', tag));
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      // Add pagination
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      // Add sorting
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);

      const queryString = queryParams.toString();
      const url = `${baseUrl}/api/v1/transactions${queryString ? `?${queryString}` : ''}`;

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
          data.error?.message || 'Failed to fetch transactions'
        );
      }

      return {
        transactions: data.data.transactions || [],
        total: data.data.total || 0,
        page: data.data.page || page,
        limit: data.data.limit || limit,
        totalPages: data.data.totalPages || 0,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for creating a transaction
 */
export const createTransaction = createAsyncThunk<
  Transaction,
  TransactionCreateInput,
  { rejectValue: string }
>(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to create transaction';
        return rejectWithValue(errorMessage);
      }

      // Automatically refetch transactions and stats after successful creation
      dispatch(fetchTransactions());
      dispatch(fetchStats());

      return data.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for getting a transaction by ID
 */
export const getTransactionById = createAsyncThunk<
  Transaction,
  string,
  { rejectValue: string }
>(
  'transactions/getTransactionById',
  async (transactionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch transaction'
        );
      }

      return data.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for updating a transaction
 */
export const updateTransaction = createAsyncThunk<
  Transaction,
  { transactionId: string; data: TransactionUpdateInput },
  { rejectValue: string }
>(
  'transactions/updateTransaction',
  async ({ transactionId, data }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error?.message || responseData.error?.details || 'Failed to update transaction';
        return rejectWithValue(errorMessage);
      }

      // Automatically refetch transactions and stats after successful update
      dispatch(fetchTransactions());
      dispatch(fetchStats());

      return responseData.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for deleting a transaction
 */
export const deleteTransaction = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'transactions/deleteTransaction',
  async (transactionId, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to delete transaction'
        );
      }

      // Automatically refetch transactions and stats after successful deletion
      dispatch(fetchTransactions());
      dispatch(fetchStats());

      return transactionId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for fetching transaction statistics
 */
export const fetchStats = createAsyncThunk<
  TransactionStats,
  { startDate?: Date; endDate?: Date } | void,
  { rejectValue: string }
>(
  'transactions/fetchStats',
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Build query string for date range
      const queryParams = new URLSearchParams();
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate instanceof Date 
          ? params.startDate.toISOString() 
          : new Date(params.startDate).toISOString());
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate instanceof Date 
          ? params.endDate.toISOString() 
          : new Date(params.endDate).toISOString());
      }

      const queryString = queryParams.toString();
      // Note: This endpoint needs to be created in a future chunk.
      // The service method getUserStats exists, but the API endpoint /api/v1/transactions/stats
      // should be created to expose this functionality. For now, this thunk is prepared
      // and will work once the endpoint is implemented.
      const url = `${baseUrl}/api/v1/transactions/stats${queryString ? `?${queryString}` : ''}`;

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
          data.error?.message || 'Failed to fetch statistics'
        );
      }

      return data.data.stats || data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for bulk creating transactions
 */
export const bulkCreateTransactions = createAsyncThunk<
  Transaction[],
  TransactionCreateInput[],
  { rejectValue: string }
>(
  'transactions/bulkCreateTransactions',
  async (transactionsData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/transactions/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions: transactionsData }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to create transactions';
        return rejectWithValue(errorMessage);
      }

      // Automatically refetch transactions and stats after successful bulk create
      dispatch(fetchTransactions());
      dispatch(fetchStats());

      return data.data.transactions || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Transactions slice
 */
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    /**
     * Set selected transaction
     */
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    /**
     * Clear selected transaction
     */
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
    /**
     * Set filters
     */
    setFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.filters = action.payload;
      // Reset to first page when filters change
      state.page = 1;
    },
    /**
     * Update a single filter
     */
    updateFilter: (state, action: PayloadAction<{ key: keyof TransactionFilters; value: any }>) => {
      const { key, value } = action.payload;
      if (value === undefined || value === null || value === '') {
        // Remove filter if value is empty
        delete state.filters[key];
      } else {
        state.filters[key] = value;
      }
      // Reset to first page when filter changes
      state.page = 1;
    },
    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters = {};
      state.page = 1;
    },
    /**
     * Set pagination
     */
    setPagination: (state, action: PayloadAction<{ page: number; limit?: number }>) => {
      state.page = action.payload.page;
      if (action.payload.limit !== undefined) {
        state.limit = action.payload.limit;
      }
    },
    /**
     * Set page
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    /**
     * Set limit
     */
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page when limit changes
    },
    /**
     * Set sorting
     */
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Reset transactions state
     */
    resetTransactions: (state) => {
      state.transactions = [];
      state.selectedTransaction = null;
      state.stats = null;
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
      state.filters = {};
      state.sortBy = 'date';
      state.sortOrder = 'desc';
      state.error = null;
      state.lastFetched = null;
      state.optimisticUpdates = {};
      state.formDraft = null;
      state.formValidationErrors = null;
      state.isFormDirty = false;
    },
    /**
     * Add optimistic transaction (for immediate UI update)
     */
    addOptimisticTransaction: (state, action: PayloadAction<{ tempId: string; transaction: Transaction }>) => {
      const { tempId, transaction } = action.payload;
      state.optimisticUpdates[tempId] = transaction;
      state.transactions.unshift(transaction);
      state.total += 1;
      state.totalPages = Math.ceil(state.total / state.limit);
    },
    /**
     * Remove optimistic transaction (on error or server confirmation)
     */
    removeOptimisticTransaction: (state, action: PayloadAction<string>) => {
      const tempId = action.payload;
      delete state.optimisticUpdates[tempId];
      state.transactions = state.transactions.filter((t) => t._id !== tempId);
      state.total = Math.max(0, state.total - 1);
      state.totalPages = Math.ceil(state.total / state.limit);
    },
    /**
     * Save form draft
     */
    saveFormDraft: (state, action: PayloadAction<Partial<TransactionCreateInput>>) => {
      state.formDraft = action.payload;
      state.isFormDirty = true;
    },
    /**
     * Clear form draft
     */
    clearFormDraft: (state) => {
      state.formDraft = null;
      state.isFormDirty = false;
      state.formValidationErrors = null;
    },
    /**
     * Set form validation errors
     */
    setFormValidationErrors: (state, action: PayloadAction<Record<string, string> | null>) => {
      state.formValidationErrors = action.payload;
    },
    /**
     * Reset form state
     */
    resetFormState: (state) => {
      state.formDraft = null;
      state.formValidationErrors = null;
      state.isFormDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch transactions';
      });

    // Create transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isCreating = false;
        // Remove any optimistic update and replace with server response
        const tempId = Object.keys(state.optimisticUpdates).find(
          (id) => state.optimisticUpdates[id]._id === action.payload._id
        );
        if (tempId) {
          delete state.optimisticUpdates[tempId];
          // Replace optimistic transaction with server response
          const index = state.transactions.findIndex((t) => t._id === tempId);
          if (index !== -1) {
            state.transactions[index] = action.payload;
          }
        } else {
          // Add new transaction to the beginning of the list if not already there
          const exists = state.transactions.some((t) => t._id === action.payload._id);
          if (!exists) {
            state.transactions.unshift(action.payload);
            state.total += 1;
            state.totalPages = Math.ceil(state.total / state.limit);
          }
        }
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create transaction';
        // Remove optimistic update on error
        // Note: We'd need to track which tempId was used, but for simplicity,
        // we'll let the automatic refetch handle cleanup
      });

    // Get transaction by ID
    builder
      .addCase(getTransactionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTransaction = action.payload;
        // Update transaction in list if it exists
        const index = state.transactions.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch transaction';
      });

    // Update transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update transaction in list
        const index = state.transactions.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        // Update selected transaction if it's the one being updated
        if (state.selectedTransaction?._id === action.payload._id) {
          state.selectedTransaction = action.payload;
        }
        // Remove from optimistic updates if it was there
        const tempId = Object.keys(state.optimisticUpdates).find(
          (id) => state.optimisticUpdates[id]._id === action.payload._id
        );
        if (tempId) {
          delete state.optimisticUpdates[tempId];
        }
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update transaction';
        // Note: Optimistic update cleanup handled by automatic refetch
      });

    // Delete transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isDeleting = false;
        // Remove transaction from list
        state.transactions = state.transactions.filter((t) => t._id !== action.payload);
        state.total -= 1;
        // Recalculate total pages
        state.totalPages = Math.ceil(state.total / state.limit);
        // Clear selected transaction if it was deleted
        if (state.selectedTransaction?._id === action.payload) {
          state.selectedTransaction = null;
        }
        // Remove from optimistic updates if it was there
        const tempId = Object.keys(state.optimisticUpdates).find(
          (id) => state.optimisticUpdates[id]._id === action.payload
        );
        if (tempId) {
          delete state.optimisticUpdates[tempId];
        }
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete transaction';
        // Note: Optimistic update cleanup handled by automatic refetch
      });

    // Fetch statistics
    builder
      .addCase(fetchStats.pending, (state) => {
        state.isFetchingStats = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isFetchingStats = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isFetchingStats = false;
        state.error = action.payload || 'Failed to fetch statistics';
      });

    // Bulk create transactions
    builder
      .addCase(bulkCreateTransactions.pending, (state) => {
        state.isBulkCreating = true;
        state.error = null;
      })
      .addCase(bulkCreateTransactions.fulfilled, (state, action) => {
        state.isBulkCreating = false;
        // Add new transactions to the beginning of the list
        action.payload.forEach((transaction) => {
          const exists = state.transactions.some((t) => t._id === transaction._id);
          if (!exists) {
            state.transactions.unshift(transaction);
          }
        });
        state.total += action.payload.length;
        state.totalPages = Math.ceil(state.total / state.limit);
        state.error = null;
      })
      .addCase(bulkCreateTransactions.rejected, (state, action) => {
        state.isBulkCreating = false;
        state.error = action.payload || 'Failed to create transactions';
      });
  },
});

export const {
  setSelectedTransaction,
  clearSelectedTransaction,
  setFilters,
  updateFilter,
  clearFilters,
  setPagination,
  setPage,
  setLimit,
  setSorting,
  clearError,
  resetTransactions,
  addOptimisticTransaction,
  removeOptimisticTransaction,
  saveFormDraft,
  clearFormDraft,
  setFormValidationErrors,
  resetFormState,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

