/**
 * Budgets Page
 * Budget management page with list, create, edit, delete, and progress display
 */

'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchBudgets,
  createBudget as createBudgetAction,
  updateBudget as updateBudgetAction,
  deleteBudget as deleteBudgetAction,
  getBudgetProgress,
  clearError,
  setSelectedBudget,
  clearSelectedBudget,
} from '@/lib/store/slices/budgetsSlice';
import { fetchCategories } from '@/lib/store/slices/categoriesSlice';
import type { Budget, BudgetCreateInput, BudgetUpdateInput } from '@/types/budget.types';
import BudgetList from '@/components/budgets/BudgetList';
import BudgetForm from '@/components/budgets/BudgetForm';
import BudgetProgress from '@/components/budgets/BudgetProgress';
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
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function BudgetsPage() {
  const dispatch = useAppDispatch();
  const {
    budgets,
    selectedBudget,
    selectedBudgetProgress,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isFetchingProgress,
    error,
  } = useAppSelector((state) => state.budgets);
  const { categories } = useAppSelector((state) => state.categories);
  const { success, error: showError } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [deleteBudget, setDeleteBudget] = useState<Budget | null>(null);
  const [filters, setFilters] = useState<{
    isActive?: boolean;
    period?: 'weekly' | 'monthly' | 'yearly';
    categoryId?: string;
  }>({});

  // Fetch budgets and categories on mount
  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch budgets when filters change
  useEffect(() => {
    dispatch(fetchBudgets(Object.keys(filters).length > 0 ? filters : undefined));
  }, [filters, dispatch]);

  // Clear error when dialogs close
  useEffect(() => {
    if (!isCreateDialogOpen && !isEditDialogOpen && !isProgressDialogOpen && error) {
      dispatch(clearError());
    }
  }, [isCreateDialogOpen, isEditDialogOpen, isProgressDialogOpen, error, dispatch]);

  const handleCreateBudget = async (data: BudgetCreateInput | BudgetUpdateInput) => {
    try {
      await dispatch(createBudgetAction(data as BudgetCreateInput)).unwrap();
      setIsCreateDialogOpen(false);
      success('Budget created', 'Your budget has been successfully created.');
      // Refresh budgets list
      dispatch(fetchBudgets(Object.keys(filters).length > 0 ? filters : undefined));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create budget';
      showError('Create failed', errorMessage);
    }
  };

  const handleEditClick = (budget: Budget) => {
    dispatch(setSelectedBudget(budget));
    setIsEditDialogOpen(true);
  };

  const handleEditBudget = async (data: BudgetUpdateInput) => {
    if (!selectedBudget) return;

    try {
      await dispatch(updateBudgetAction({ budgetId: selectedBudget._id, data })).unwrap();
      setIsEditDialogOpen(false);
      dispatch(clearSelectedBudget());
      success('Budget updated', 'Your budget has been successfully updated.');
      // Refresh budgets list
      dispatch(fetchBudgets(Object.keys(filters).length > 0 ? filters : undefined));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update budget';
      showError('Update failed', errorMessage);
    }
  };

  const handleViewProgressClick = async (budget: Budget) => {
    dispatch(setSelectedBudget(budget));
    setIsProgressDialogOpen(true);
    // Fetch progress
    try {
      await dispatch(getBudgetProgress(budget._id)).unwrap();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget progress';
      showError('Progress fetch failed', errorMessage);
    }
  };

  const handleRefreshProgress = async () => {
    if (!selectedBudget) return;
    try {
      await dispatch(getBudgetProgress(selectedBudget._id)).unwrap();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh progress';
      showError('Refresh failed', errorMessage);
    }
  };

  const handleDeleteClick = (budget: Budget) => {
    setDeleteBudget(budget);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBudget) return;

    try {
      await dispatch(deleteBudgetAction(deleteBudget._id)).unwrap();
      setDeleteBudget(null);
      success('Budget deleted', 'The budget has been successfully deleted.');
      // Refresh budgets list
      dispatch(fetchBudgets(Object.keys(filters).length > 0 ? filters : undefined));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete budget';
      showError('Delete failed', errorMessage);
    }
  };

  // Build progress map for inline display
  // Note: Inline progress is intentionally deferred to avoid performance issues
  // when there are many budgets. Progress is available in the detail view.
  // Future enhancement: Could fetch progress for visible budgets on-demand or
  // implement pagination with progress fetching for visible items only.
  const budgetProgressMap: Record<string, {
    percentageUsed: number;
    isExceeded: boolean;
    alertTriggered: boolean;
  }> = {};

  // Get expense categories for budget form
  const expenseCategories = categories.filter((cat) => cat.type === 'expense' || cat.type === 'both');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">
          Create and manage your spending budgets to track your financial goals.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Budget List */}
      <BudgetList
        budgets={budgets}
        isLoading={isLoading}
        onCreateClick={() => setIsCreateDialogOpen(true)}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onViewProgressClick={handleViewProgressClick}
        onFilterChange={setFilters}
        filters={filters}
        categories={expenseCategories}
        budgetProgress={budgetProgressMap}
      />

      {/* Create Budget Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Budget</DialogTitle>
            <DialogDescription>
              Create a new budget to track your spending.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleCreateBudget}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
            error={error}
            categories={expenseCategories}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          dispatch(clearSelectedBudget());
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget details.
            </DialogDescription>
          </DialogHeader>
          {selectedBudget && (
            <BudgetForm
              onSubmit={handleEditBudget}
              onCancel={() => {
                setIsEditDialogOpen(false);
                dispatch(clearSelectedBudget());
              }}
              isLoading={isUpdating}
              error={error}
              initialData={selectedBudget}
              categories={expenseCategories}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={isProgressDialogOpen} onOpenChange={(open) => {
        setIsProgressDialogOpen(open);
        if (!open) {
          dispatch(clearSelectedBudget());
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Budget Progress</DialogTitle>
            <DialogDescription>
              View detailed progress and spending for this budget.
            </DialogDescription>
          </DialogHeader>
          {selectedBudget && selectedBudgetProgress && (
            <BudgetProgress
              budget={selectedBudget}
              progress={selectedBudgetProgress}
              isLoading={isFetchingProgress}
              onRefresh={handleRefreshProgress}
            />
          )}
          {selectedBudget && !selectedBudgetProgress && !isFetchingProgress && (
            <div className="py-8 text-center text-muted-foreground">
              <p>No progress data available.</p>
            </div>
          )}
          {isFetchingProgress && (
            <div className="py-8 text-center">
              <LoadingSpinner size="md" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteBudget} onOpenChange={(open) => !open && setDeleteBudget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteBudget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

