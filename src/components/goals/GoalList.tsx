/**
 * Goal List Component
 * Displays a list of goals with filters, progress summaries, and actions
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter, TrendingUp, AlertCircle, Eye, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { Goal, GoalCategory, GoalStatus } from '@/types/goal.types';
import { cn } from '@/lib/utils/cn';

interface GoalListProps {
  goals: Goal[];
  isLoading?: boolean;
  onCreateClick?: () => void;
  onEditClick?: (goal: Goal) => void;
  onDeleteClick?: (goal: Goal) => void;
  onViewProgressClick?: (goal: Goal) => void;
  onFilterChange?: (filters: {
    status?: GoalStatus;
    category?: GoalCategory;
    isCompleted?: boolean;
  }) => void;
  filters?: {
    status?: GoalStatus;
    category?: GoalCategory;
    isCompleted?: boolean;
  };
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Calculate progress percentage from goal data
const calculateProgressPercentage = (goal: Goal): number => {
  if (goal.targetAmount <= 0) return 0;
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

// Calculate days remaining
const calculateDaysRemaining = (goal: Goal): number | null => {
  if (!goal.targetDate) return null;
  const now = new Date();
  const targetDate = typeof goal.targetDate === 'string' ? new Date(goal.targetDate) : goal.targetDate;
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Check if goal is overdue
const isGoalOverdue = (goal: Goal): boolean => {
  if (!goal.targetDate || goal.isCompleted) return false;
  const now = new Date();
  const targetDate = typeof goal.targetDate === 'string' ? new Date(goal.targetDate) : goal.targetDate;
  return targetDate < now && goal.currentAmount < goal.targetAmount;
};

export default function GoalList({
  goals,
  isLoading = false,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onViewProgressClick,
  onFilterChange,
  filters = {},
}: GoalListProps) {
  const [localStatusFilter, setLocalStatusFilter] = useState<string>(
    filters.status || 'all'
  );
  const [localCategoryFilter, setLocalCategoryFilter] = useState<string>(
    filters.category || 'all'
  );
  const [localCompletedFilter, setLocalCompletedFilter] = useState<string>(
    filters.isCompleted !== undefined ? (filters.isCompleted ? 'completed' : 'not-completed') : 'all'
  );

  useEffect(() => {
    setLocalStatusFilter(filters.status || 'all');
    setLocalCategoryFilter(filters.category || 'all');
    setLocalCompletedFilter(
      filters.isCompleted !== undefined ? (filters.isCompleted ? 'completed' : 'not-completed') : 'all'
    );
  }, [filters]);

  const handleFilterChange = () => {
    if (!onFilterChange) return;

    const newFilters: {
      status?: GoalStatus;
      category?: GoalCategory;
      isCompleted?: boolean;
    } = {};

    if (localStatusFilter !== 'all') {
      newFilters.status = localStatusFilter as GoalStatus;
    }

    if (localCategoryFilter !== 'all') {
      newFilters.category = localCategoryFilter as GoalCategory;
    }

    if (localCompletedFilter !== 'all') {
      newFilters.isCompleted = localCompletedFilter === 'completed';
    }

    onFilterChange(newFilters);
  };

  useEffect(() => {
    handleFilterChange();
  }, [localStatusFilter, localCategoryFilter, localCompletedFilter]);

  const getStatusBadge = (status: GoalStatus, isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Completed
        </Badge>
      );
    }

    const colors = {
      active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return (
      <Badge className={colors[status] || colors.active}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: GoalCategory) => {
    const labels = {
      savings: 'Savings',
      debt_payoff: 'Debt Payoff',
      investment: 'Investment',
      purchase: 'Purchase',
      other: 'Other',
    };
    return labels[category] || category;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Goals</CardTitle>
            <CardDescription>
              Track your financial goals and monitor progress
            </CardDescription>
          </div>
          {onCreateClick && (
            <Button onClick={onCreateClick} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        {onFilterChange && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={localStatusFilter} onValueChange={setLocalStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={localCategoryFilter} onValueChange={setLocalCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="debt_payoff">Debt Payoff</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={localCompletedFilter} onValueChange={setLocalCompletedFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Completion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-completed">Not Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Goals List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No goals found</p>
            <p className="text-sm">Create your first goal to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const progressPercentage = calculateProgressPercentage(goal);
              const daysRemaining = calculateDaysRemaining(goal);
              const isOverdue = isGoalOverdue(goal);
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

              return (
                <div
                  key={goal._id}
                  className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {goal.icon && (
                          <span className="text-xl" style={{ color: goal.color || undefined }}>
                            {goal.icon}
                          </span>
                        )}
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        {getStatusBadge(goal.status, goal.isCompleted)}
                        {isOverdue && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>

                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      )}

                      <div className="space-y-2">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              {formatCurrency(goal.currentAmount, goal.currency)} /{' '}
                              {formatCurrency(goal.targetAmount, goal.currency)}
                            </span>
                            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className={cn(
                              'h-2',
                              goal.isCompleted
                                ? 'bg-green-500'
                                : isOverdue
                                ? 'bg-red-500'
                                : progressPercentage >= 75
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            )}
                          />
                        </div>

                        {/* Goal Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{getCategoryBadge(goal.category)}</span>
                          </div>
                          {daysRemaining !== null && (
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              <span>
                                {daysRemaining > 0
                                  ? `${daysRemaining} days remaining`
                                  : 'Past due date'}
                              </span>
                            </div>
                          )}
                          {remaining > 0 && (
                            <span>
                              {formatCurrency(remaining, goal.currency)} remaining
                            </span>
                          )}
                          {goal.isCompleted && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Goal Achieved!
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {onViewProgressClick && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewProgressClick(goal)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEditClick && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditClick(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDeleteClick && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteClick(goal)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

