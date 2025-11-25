/**
 * Category Model
 * Mongoose schema and model for Category entity
 */

import { Schema, model, models, Document, Types } from 'mongoose';
import type { CategoryType } from '@/types/category.types';

/**
 * Category Schema
 */
const CategorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [1, 'Category name must be at least 1 character long'],
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense', 'both'],
        message: 'Category type must be one of: income, expense, both',
      },
      required: [true, 'Category type is required'],
      default: 'expense',
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [50, 'Icon identifier cannot exceed 50 characters'],
    },
    color: {
      type: String,
      trim: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color code'],
    },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
      default: null,
      validate: {
        validator: function (this: ICategory, value: Types.ObjectId | null) {
          // Prevent self-referencing
          if (value && this._id && value.toString() === this._id.toString()) {
            return false;
          }
          return true;
        },
        message: 'Category cannot be its own parent',
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'categories',
  }
);

/**
 * Indexes for efficient queries
 */
// Compound index for user categories by type (most common query)
CategorySchema.index({ userId: 1, type: 1 });

// Compound index for user categories by name (for searching)
CategorySchema.index({ userId: 1, name: 1 });

// Text index for full-text search on category name
CategorySchema.index({ name: 'text' });

// Index for parent category relationships
CategorySchema.index({ parentCategoryId: 1 });

// Index for default categories
CategorySchema.index({ userId: 1, isDefault: 1 });

// Index for sorting by creation date
CategorySchema.index({ userId: 1, createdAt: -1 });

/**
 * Category Interface (Mongoose Document)
 */
export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  parentCategoryId?: Types.ObjectId | null;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Virtual: Get parent category (populate helper)
 */
CategorySchema.virtual('parentCategory', {
  ref: 'Category',
  localField: 'parentCategoryId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Virtual: Get subcategories (populate helper)
 */
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategoryId',
});

/**
 * Ensure virtuals are included in JSON output
 */
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// Note: Parent category validation can be done at the service layer
// Pre-save hooks with async validation can cause TypeScript issues
// The schema validator already prevents self-referencing

/**
 * Static method: Find categories by user and type
 */
CategorySchema.statics.findByUserAndType = async function (
  userId: string | Types.ObjectId,
  type?: CategoryType
) {
  const query: any = { userId };
  if (type) {
    query.type = { $in: [type, 'both'] };
  }
  return this.find(query).sort({ name: 1 });
};

/**
 * Static method: Find default categories
 */
CategorySchema.statics.findDefaultCategories = async function (userId: string | Types.ObjectId) {
  return this.find({ userId, isDefault: true }).sort({ name: 1 });
};

/**
 * Static method: Find root categories (no parent)
 */
CategorySchema.statics.findRootCategories = async function (
  userId: string | Types.ObjectId,
  type?: CategoryType
) {
  const query: any = { userId, parentCategoryId: null };
  if (type) {
    query.type = { $in: [type, 'both'] };
  }
  return this.find(query).sort({ name: 1 });
};

/**
 * Static method: Find subcategories
 */
CategorySchema.statics.findSubcategories = async function (parentCategoryId: string | Types.ObjectId) {
  return this.find({ parentCategoryId }).sort({ name: 1 });
};

/**
 * Instance method: Check if category has subcategories
 */
CategorySchema.methods.hasSubcategories = async function () {
  const count = await this.model('Category').countDocuments({ parentCategoryId: this._id });
  return count > 0;
};

// Export Category model (use existing model if available, otherwise create new one)
export const Category = models.Category || model<ICategory>('Category', CategorySchema);

