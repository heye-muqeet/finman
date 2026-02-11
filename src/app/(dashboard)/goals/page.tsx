/**
 * Goals Page
 * Goal management page with list, create, edit, delete, and progress display
 */

'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchGoals,
  createGoal as createGoalAction,
  updateGoal as updateGoalAction,
  deleteGoal as deleteGoalAction,
  getGoalProgress,
  clearError,
  setSelectedGoal,
  clearSelectedGoal,
} from '@/lib/store/slices/goalsSlice';
import type { Goal, GoalCreateInput, GoalUpdateInput } from '@/types/goal.types';
import GoalList from '@/components/goals/GoalList';
import GoalForm from '@/components/goals/GoalForm';
import GoalProgress from '@/components/goals/GoalProgress';
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

export default function GoalsPage() {
  const dispatch = useAppDispatch();
  const {
    goals,
    selectedGoal,
    selectedGoalProgress,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isFetchingProgress,
    error,
  } = useAppSelector((state) => state.goals);
  const { success, error: showError } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [deleteGoal, setDeleteGoal] = useState<Goal | null>(null);
  const [filters, setFilters] = useState<{
    status?: 'active' | 'completed' | 'paused' | 'cancelled';
    category?: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'other';
    isCompleted?: boolean;
  }>({});

  // Fetch goals on mount
  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Fetch goals when filters change
  useEffect(() => {
    dispatch(fetchGoals(Object.keys(filters).length > 0 ? filters : undefined));
  }, [dispatch, filters]);

  // Handle create goal
  const handleCreateGoal = async (data: GoalCreateInput | GoalUpdateInput) => {
    try {
      await dispatch(createGoalAction(data as GoalCreateInput)).unwrap();
      success('Goal created successfully');
      setIsCreateDialogOpen(false);
      dispatch(fetchGoals(Object.keys(filters).length > 0 ? filters : undefined));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      showError(errorMessage);
    }
  };

  // Handle edit goal
  const handleEditGoal = async (data: GoalCreateInput | GoalUpdateInput) => {
    if (!selectedGoal) return;

    try {
      await dispatch(
        updateGoalAction({
          goalId: selectedGoal._id,
          data: data as GoalUpdateInput,
        })
      ).unwrap();
      success('Goal updated successfully');
      setIsEditDialogOpen(false);
      dispatch(clearSelectedGoal());
      dispatch(fetchGoals(Object.keys(filters).length > 0 ? filters : undefined));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      showError(errorMessage);
    }
  };

  // Handle delete goal
  const handleDeleteGoal = async () => {
    if (!deleteGoal) return;

    try {
      await dispatch(deleteGoalAction(deleteGoal._id)).unwrap();
      success('Goal deleted successfully');
      setDeleteGoal(null);
      dispatch(fetchGoals(Object.keys(filters).length > 0 ? filters : undefined));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      showError(errorMessage);
    }
  };

  // Handle view progress
  const handleViewProgress = async (goal: Goal) => {
    dispatch(setSelectedGoal(goal));
    setIsProgressDialogOpen(true);
    try {
      await dispatch(getGoalProgress(goal._id)).unwrap();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goal progress';
      showError(errorMessage);
    }
  };

  // Handle refresh progress
  const handleRefreshProgress = async () => {
    if (!selectedGoal) return;
    try {
      await dispatch(getGoalProgress(selectedGoal._id)).unwrap();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh goal progress';
      showError(errorMessage);
    }
  };

  // Handle edit click
  const handleEditClick = (goal: Goal) => {
    dispatch(setSelectedGoal(goal));
    setIsEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (goal: Goal) => {
    setDeleteGoal(goal);
  };

  // Clear error when dialogs close
  useEffect(() => {
    if (!isCreateDialogOpen && !isEditDialogOpen && !isProgressDialogOpen) {
      dispatch(clearError());
    }
  }, [isCreateDialogOpen, isEditDialogOpen, isProgressDialogOpen, dispatch]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>
        <p className="text-muted-foreground">Track and manage your financial goals</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Goals List */}
      <GoalList
        goals={goals}
        isLoading={isLoading}
        onCreateClick={() => setIsCreateDialogOpen(true)}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onViewProgressClick={handleViewProgress}
        onFilterChange={setFilters}
        filters={filters}
      />

      {/* Create Goal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set a new financial goal and start tracking your progress
            </DialogDescription>
          </DialogHeader>
          <GoalForm
            onSubmit={handleCreateGoal}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
            error={error}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update your goal details</DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <GoalForm
              onSubmit={handleEditGoal}
              onCancel={() => {
                setIsEditDialogOpen(false);
                dispatch(clearSelectedGoal());
              }}
              isLoading={isUpdating}
              error={error}
              initialData={selectedGoal}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Goal Progress</DialogTitle>
            <DialogDescription>Detailed progress information for your goal</DialogDescription>
          </DialogHeader>
          {selectedGoal && selectedGoalProgress ? (
            <GoalProgress
              goal={selectedGoal}
              progress={selectedGoalProgress}
              isLoading={isFetchingProgress}
              onRefresh={handleRefreshProgress}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteGoal}
        onOpenChange={(open) => !open && setDeleteGoal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteGoal?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGoal}
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

