/**
 * Category TypeScript Types
 * Type definitions for Category entity
 */

/**
 * Category Type Enum
 */
export type CategoryType = 'income' | 'expense' | 'both';

/**
 * Category Interface (Mongoose Document)
 */
export interface ICategory {
  userId: string; // ObjectId reference to User
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  parentCategoryId?: string; // ObjectId reference to Category (for subcategories)
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category Type (for API responses and client-side usage)
 */
export interface Category {
  _id: string;
  userId: string;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  parentCategoryId?: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category Create Input Type
 */
export interface CategoryCreateInput {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  parentCategoryId?: string;
  isDefault?: boolean;
}

/**
 * Category Update Input Type
 */
export interface CategoryUpdateInput {
  name?: string;
  type?: CategoryType;
  icon?: string;
  color?: string;
  parentCategoryId?: string;
  isDefault?: boolean;
}

/**
 * Category Response Type
 */
export interface CategoryResponse {
  category: Category;
  message?: string;
}

/**
 * Categories List Response Type
 */
export interface CategoriesListResponse {
  categories: Category[];
  total: number;
  message?: string;
}

