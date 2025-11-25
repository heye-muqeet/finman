/**
 * Categories Page
 * Category management page with list view and create form
 */

'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchCategories,
  createCategory as createCategoryAction,
  deleteCategory as deleteCategoryAction,
  clearError,
} from '@/lib/store/slices/categoriesSlice';
import type { Category, CategoryType, CategoryCreateInput } from '@/types/category.types';
import CategoryList from '@/components/categories/CategoryList';
import CategoryForm from '@/components/categories/CategoryForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const {
    categories,
    isLoading,
    isCreating,
    isDeleting,
    error,
  } = useAppSelector((state) => state.categories);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [typeFilter, setTypeFilter] = useState<CategoryType | 'all'>('all');

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Clear error when dialog closes
  useEffect(() => {
    if (!isCreateDialogOpen && error) {
      dispatch(clearError());
    }
  }, [isCreateDialogOpen, error, dispatch]);

  const handleCreateCategory = async (data: CategoryCreateInput) => {
    try {
      await dispatch(createCategoryAction(data)).unwrap();
      setIsCreateDialogOpen(false);
      // Refresh categories list
      dispatch(fetchCategories({ type: typeFilter !== 'all' ? typeFilter : undefined }));
    } catch (err) {
      // Error is handled by Redux state
      console.error('Failed to create category:', err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      await dispatch(deleteCategoryAction(deleteCategory._id)).unwrap();
      setDeleteCategory(null);
      // Refresh categories list
      dispatch(fetchCategories({ type: typeFilter !== 'all' ? typeFilter : undefined }));
    } catch (err) {
      // Error is handled by Redux state
      console.error('Failed to delete category:', err);
    }
  };

  const handleTypeFilterChange = (type: CategoryType | 'all') => {
    setTypeFilter(type);
    dispatch(fetchCategories({ type: type !== 'all' ? type : undefined }));
  };

  // Get root categories for parent selection
  const rootCategories = categories.filter((cat) => !cat.parentCategoryId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Organize your transactions with custom categories
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Category List */}
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onCreateClick={() => setIsCreateDialogOpen(true)}
        onDeleteClick={setDeleteCategory}
        onTypeFilterChange={handleTypeFilterChange}
        selectedType={typeFilter}
      />

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your transactions
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
            error={error}
            parentCategories={rootCategories}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;{deleteCategory?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

