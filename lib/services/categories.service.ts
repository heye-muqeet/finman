/**
 * Category Service
 * Handles category CRUD operations and business logic
 */

import { Types } from 'mongoose';
import { Category, ICategory } from '@/models/Category';
import { connectDB } from '@/lib/database/connection';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/utils/error-handler';
import { loggerService } from '@/lib/services/logger.service';
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryResponse,
  CategoriesListResponse,
  CategoryType,
  Category as CategoryDTO,
} from '@/types/category.types';

/**
 * Convert Mongoose document to plain Category object
 */
function toCategoryObject(category: ICategory): CategoryDTO {
  return {
    _id: category._id.toString(),
    userId: category.userId.toString(),
    name: category.name,
    type: category.type,
    icon: category.icon,
    color: category.color,
    parentCategoryId: category.parentCategoryId?.toString(),
    isDefault: category.isDefault || false,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

/**
 * Create a new category
 * @param userId - User ID
 * @param input - Category creation data
 * @returns Created category
 */
export async function createCategory(
  userId: string,
  input: CategoryCreateInput
): Promise<CategoryResponse> {
  await connectDB();

  try {
    // Validate parent category exists if provided
    if (input.parentCategoryId) {
      const parentCategory = await Category.findById(input.parentCategoryId);
      if (!parentCategory) {
        throw new ValidationError('Parent category does not exist');
      }
      // Ensure parent category belongs to the same user
      if (parentCategory.userId.toString() !== userId) {
        throw new ForbiddenError('Parent category belongs to a different user');
      }
      // Prevent circular references by checking parent's parent
      if (parentCategory.parentCategoryId) {
        const grandParent = await Category.findById(parentCategory.parentCategoryId);
        if (grandParent && grandParent.parentCategoryId?.toString() === userId) {
          throw new ValidationError('Circular reference detected in category hierarchy');
        }
      }
    }

    // Check for duplicate category name for the same user and type
    const existingCategory = await Category.findOne({
      userId: new Types.ObjectId(userId),
      name: input.name.trim(),
      type: input.type,
    });
    if (existingCategory) {
      throw new ValidationError(
        `Category with name "${input.name}" and type "${input.type}" already exists`
      );
    }

    // Create category
    const category = new Category({
      userId: new Types.ObjectId(userId),
      name: input.name.trim(),
      type: input.type,
      icon: input.icon?.trim(),
      color: input.color?.trim(),
      parentCategoryId: input.parentCategoryId ? new Types.ObjectId(input.parentCategoryId) : null,
      isDefault: input.isDefault || false,
    });

    await category.save();

    loggerService.logDatabase('CREATE', 'categories', {
      userId,
      categoryId: category._id.toString(),
      categoryName: category.name,
    });
    loggerService.logUserAction('create_category', userId, {
      categoryId: category._id.toString(),
      categoryName: category.name,
    });

    return {
      category: toCategoryObject(category),
      message: 'Category created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to create category', error, { userId });
    throw new ValidationError('Failed to create category');
  }
}

/**
 * Get all categories for a user
 * @param userId - User ID
 * @param type - Optional category type filter
 * @param includeSubcategories - Whether to include subcategories
 * @returns List of categories
 */
export async function getUserCategories(
  userId: string,
  type?: CategoryType,
  includeSubcategories: boolean = true
): Promise<CategoriesListResponse> {
  await connectDB();

  try {
    let query: any = { userId: new Types.ObjectId(userId) };

    if (type) {
      query.type = { $in: [type, 'both'] };
    }

    if (!includeSubcategories) {
      query.parentCategoryId = null;
    }

    const categories = await Category.find(query).sort({ name: 1 });

    loggerService.logDatabase('FIND', 'categories', {
      userId,
      type,
      count: categories.length,
    });

    return {
      categories: categories.map(toCategoryObject),
      total: categories.length,
      message: 'Categories retrieved successfully',
    };
  } catch (error) {
    loggerService.error('Failed to get user categories', error, { userId });
    throw new ValidationError('Failed to retrieve categories');
  }
}

/**
 * Get category by ID
 * @param userId - User ID
 * @param categoryId - Category ID
 * @returns Category
 */
export async function getCategoryById(
  userId: string,
  categoryId: string
): Promise<CategoryResponse> {
  await connectDB();

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category', categoryId);
    }

    // Ensure category belongs to the user
    if (category.userId.toString() !== userId) {
      throw new ForbiddenError('Category does not belong to this user');
    }

    loggerService.logDatabase('FIND', 'categories', {
      userId,
      categoryId: category._id.toString(),
    });

    return {
      category: toCategoryObject(category),
      message: 'Category retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to get category', error, { userId, categoryId });
    throw new ValidationError('Failed to retrieve category');
  }
}

/**
 * Update category
 * @param userId - User ID
 * @param categoryId - Category ID
 * @param input - Category update data
 * @returns Updated category
 */
export async function updateCategory(
  userId: string,
  categoryId: string,
  input: CategoryUpdateInput
): Promise<CategoryResponse> {
  await connectDB();

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category', categoryId);
    }

    // Ensure category belongs to the user
    if (category.userId.toString() !== userId) {
      throw new ForbiddenError('Category does not belong to this user');
    }

    // Validate parent category exists if provided
    if (input.parentCategoryId !== undefined) {
      if (input.parentCategoryId) {
        const parentCategory = await Category.findById(input.parentCategoryId);
        if (!parentCategory) {
          throw new ValidationError('Parent category does not exist');
        }
        // Ensure parent category belongs to the same user
        if (parentCategory.userId.toString() !== userId) {
          throw new ForbiddenError('Parent category belongs to a different user');
        }
        // Prevent self-referencing
        if (parentCategory._id.toString() === categoryId) {
          throw new ValidationError('Category cannot be its own parent');
        }
        // Prevent circular references
        if (parentCategory.parentCategoryId?.toString() === categoryId) {
          throw new ValidationError('Circular reference detected in category hierarchy');
        }
      }
    }

    // Check for duplicate category name if name or type is being updated
    if (input.name || input.type) {
      const nameToCheck = input.name?.trim() || category.name;
      const typeToCheck = input.type || category.type;

      const existingCategory = await Category.findOne({
        userId: new Types.ObjectId(userId),
        name: nameToCheck,
        type: typeToCheck,
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        throw new ValidationError(
          `Category with name "${nameToCheck}" and type "${typeToCheck}" already exists`
        );
      }
    }

    // Update category fields
    if (input.name !== undefined) {
      category.name = input.name.trim();
    }
    if (input.type !== undefined) {
      category.type = input.type;
    }
    if (input.icon !== undefined) {
      category.icon = input.icon?.trim();
    }
    if (input.color !== undefined) {
      category.color = input.color?.trim();
    }
    if (input.parentCategoryId !== undefined) {
      category.parentCategoryId = input.parentCategoryId
        ? new Types.ObjectId(input.parentCategoryId)
        : null;
    }
    if (input.isDefault !== undefined) {
      category.isDefault = input.isDefault;
    }

    await category.save();

    loggerService.logDatabase('UPDATE', 'categories', {
      userId,
      categoryId: category._id.toString(),
    });
    loggerService.logUserAction('update_category', userId, {
      categoryId: category._id.toString(),
      fields: Object.keys(input),
    });

    return {
      category: toCategoryObject(category),
      message: 'Category updated successfully',
    };
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to update category', error, { userId, categoryId });
    throw new ValidationError('Failed to update category');
  }
}

/**
 * Delete category
 * @param userId - User ID
 * @param categoryId - Category ID
 */
export async function deleteCategory(userId: string, categoryId: string): Promise<void> {
  await connectDB();

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category', categoryId);
    }

    // Ensure category belongs to the user
    if (category.userId.toString() !== userId) {
      throw new ForbiddenError('Category does not belong to this user');
    }

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({
      parentCategoryId: categoryId,
    });

    if (subcategoriesCount > 0) {
      throw new ValidationError(
        'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
      );
    }

    await Category.findByIdAndDelete(categoryId);

    loggerService.logDatabase('DELETE', 'categories', {
      userId,
      categoryId,
      categoryName: category.name,
    });
    loggerService.logUserAction('delete_category', userId, {
      categoryId,
      categoryName: category.name,
    });
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ForbiddenError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    loggerService.error('Failed to delete category', error, { userId, categoryId });
    throw new ValidationError('Failed to delete category');
  }
}

/**
 * Get root categories (categories without parent)
 * @param userId - User ID
 * @param type - Optional category type filter
 * @returns List of root categories
 */
export async function getRootCategories(
  userId: string,
  type?: CategoryType
): Promise<CategoriesListResponse> {
  await connectDB();

  try {
    const query: any = {
      userId: new Types.ObjectId(userId),
      parentCategoryId: null,
    };

    if (type) {
      query.type = { $in: [type, 'both'] };
    }

    const categories = await Category.find(query).sort({ name: 1 });

    loggerService.logDatabase('FIND', 'categories', {
      userId,
      type,
      rootOnly: true,
      count: categories.length,
    });

    return {
      categories: categories.map(toCategoryObject),
      total: categories.length,
      message: 'Root categories retrieved successfully',
    };
  } catch (error) {
    loggerService.error('Failed to get root categories', error, { userId });
    throw new ValidationError('Failed to retrieve root categories');
  }
}

/**
 * Get subcategories for a parent category
 * @param userId - User ID
 * @param parentCategoryId - Parent category ID
 * @returns List of subcategories
 */
export async function getSubcategories(
  userId: string,
  parentCategoryId: string
): Promise<CategoriesListResponse> {
  await connectDB();

  try {
    // Verify parent category exists and belongs to user
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      throw new NotFoundError('Parent category', parentCategoryId);
    }
    if (parentCategory.userId.toString() !== userId) {
      throw new ForbiddenError('Parent category does not belong to this user');
    }

    const subcategories = await Category.find({
      parentCategoryId: new Types.ObjectId(parentCategoryId),
    }).sort({ name: 1 });

    loggerService.logDatabase('FIND', 'categories', {
      userId,
      parentCategoryId,
      count: subcategories.length,
    });

    return {
      categories: subcategories.map(toCategoryObject),
      total: subcategories.length,
      message: 'Subcategories retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    loggerService.error('Failed to get subcategories', error, { userId, parentCategoryId });
    throw new ValidationError('Failed to retrieve subcategories');
  }
}

