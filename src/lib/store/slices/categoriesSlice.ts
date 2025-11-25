/**
 * Categories Redux Slice
 * Handles category state management and API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryType,
} from '@/types/category.types';

/**
 * Categories state interface
 */
export interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  total: number;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp of last successful fetch
}

/**
 * Initial categories state
 */
const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  total: 0,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  lastFetched: null,
};

/**
 * Fetch categories parameters
 */
export interface FetchCategoriesParams {
  type?: CategoryType;
  includeSubcategories?: boolean;
}

/**
 * Async thunk for fetching categories
 */
export const fetchCategories = createAsyncThunk<
  { categories: Category[]; total: number },
  FetchCategoriesParams | void,
  { rejectValue: string }
>(
  'categories/fetchCategories',
  async (params, { rejectWithValue, getState }) => {
    try {
      // Get token from localStorage or state
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      if (params?.includeSubcategories !== undefined) {
        queryParams.append('includeSubcategories', params.includeSubcategories.toString());
      }
      const queryString = queryParams.toString();
      const url = `${baseUrl}/api/v1/categories${queryString ? `?${queryString}` : ''}`;

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
          data.error?.message || 'Failed to fetch categories'
        );
      }

      return {
        categories: data.data.categories || [],
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
 * Async thunk for creating a category
 */
export const createCategory = createAsyncThunk<
  Category,
  CategoryCreateInput,
  { rejectValue: string }
>(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error?.details || 'Failed to create category';
        return rejectWithValue(errorMessage);
      }

      return data.data.category;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for getting a category by ID
 */
export const getCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>(
  'categories/getCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/categories/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to fetch category'
        );
      }

      return data.data.category;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for updating a category
 */
export const updateCategory = createAsyncThunk<
  Category,
  { categoryId: string; data: CategoryUpdateInput },
  { rejectValue: string }
>(
  'categories/updateCategory',
  async ({ categoryId, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error?.message || responseData.error?.details || 'Failed to update category';
        return rejectWithValue(errorMessage);
      }

      return responseData.data.category;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Async thunk for deleting a category
 */
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/v1/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error?.message || 'Failed to delete category'
        );
      }

      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

/**
 * Categories slice
 */
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    /**
     * Set selected category
     */
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    /**
     * Clear selected category
     */
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Reset categories state
     */
    resetCategories: (state) => {
      state.categories = [];
      state.selectedCategory = null;
      state.total = 0;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.total = action.payload.total;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isCreating = false;
        state.categories.push(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create category';
      });

    // Get category by ID
    builder
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
        // Update category in list if it exists
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch category';
      });

    // Update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        // Update selected category if it's the one being updated
        if (state.selectedCategory?._id === action.payload._id) {
          state.selectedCategory = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update category';
      });

    // Delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
        state.total -= 1;
        // Clear selected category if it was deleted
        if (state.selectedCategory?._id === action.payload) {
          state.selectedCategory = null;
        }
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete category';
      });
  },
});

export const {
  setSelectedCategory,
  clearSelectedCategory,
  clearError,
  resetCategories,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

