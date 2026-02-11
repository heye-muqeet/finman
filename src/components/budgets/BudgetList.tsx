/**
 * Budget List Component
 * Displays a list of budgets with filters, progress summaries, and actions
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter, TrendingUp, AlertCircle, Eye } from 'lucide-react';
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
import type { Budget, BudgetPeriod } from '@/types/budget.types';
import { cn } from '@/lib/utils/cn';

interface BudgetListProps {
  budgets: Budget[];
  isLoading?: boolean;
  onCreateClick?: () => void;
  onEditClick?: (budget: Budget) => void;
  onDeleteClick?: (budget: Budget) => void;
  onViewProgressClick?: (budget: Budget) => void;
  onFilterChange?: (filters: {
    isActive?: boolean;
    period?: BudgetPeriod;
    categoryId?: string;
  }) => void;
  filters?: {
    isActive?: boolean;
    period?: BudgetPeriod;
    categoryId?: string;
  };
  categories?: Array<{ _id: string; name: string }>;
  budgetProgress?: Record<string, { percentageUsed: number; isExceeded: boolean; alertTriggered: boolean }>;
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

export default function BudgetList({
  budgets,
  isLoading = false,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onViewProgressClick,
  onFilterChange,
  filters = {},
  categories = [],
  budgetProgress = {},
}: BudgetListProps) {
  const [localIsActiveFilter, setLocalIsActiveFilter] = useState<string>(
    filters.isActive !== undefined ? (filters.isActive ? 'active' : 'inactive') : 'all'
  );
  const [localPeriodFilter, setLocalPeriodFilter] = useState<string>(
    filters.period || 'all'
  );
  const [localCategoryFilter, setLocalCategoryFilter] = useState<string>(
    filters.categoryId || 'all'
  );

  useEffect(() => {
    setLocalIsActiveFilter(
      filters.isActive !== undefined ? (filters.isActive ? 'active' : 'inactive') : 'all'
    );
    setLocalPeriodFilter(filters.period || 'all');
    setLocalCategoryFilter(filters.categoryId || 'all');
  }, [filters]);

  const handleFilterChange = () => {
    if (!onFilterChange) return;

    const newFilters: {
      isActive?: boolean;
      period?: BudgetPeriod;
      categoryId?: string;
    } = {};

    if (localIsActiveFilter !== 'all') {
      newFilters.isActive = localIsActiveFilter === 'active';
    }

    if (localPeriodFilter !== 'all') {
      newFilters.period = localPeriodFilter as BudgetPeriod;
    }

    if (localCategoryFilter !== 'all') {
      newFilters.categoryId = localCategoryFilter;
    }

    onFilterChange(newFilters);
  };

  useEffect(() => {
    handleFilterChange();
  }, [localIsActiveFilter, localPeriodFilter, localCategoryFilter]);

  const getPeriodBadge = (period: BudgetPeriod) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      monthly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      yearly: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[period] || '';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Budgets</CardTitle>
            <CardDescription>
              Manage your spending budgets and track progress
            </CardDescription>
          </div>
          {onCreateClick && (
            <Button onClick={onCreateClick} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        {onFilterChange && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={localIsActiveFilter} onValueChange={setLocalIsActiveFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={localPeriodFilter} onValueChange={setLocalPeriodFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {categories.length > 0 && (
              <Select value={localCategoryFilter} onValueChange={setLocalCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Budgets List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No budgets found.</p>
            {onCreateClick && (
              <Button
                variant="link"
                onClick={onCreateClick}
                className="mt-2"
              >
                Create your first budget
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => {
              const progress = budgetProgress[budget._id];
              const percentageUsed = progress?.percentageUsed || 0;
              const isExceeded = progress?.isExceeded || false;
              const alertTriggered = progress?.alertTriggered || false;

              return (
                <div
                  key={budget._id}
                  className="rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Budget Header */}
                      <div className="flex items-center gap-2">
                        {budget.color && (
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: budget.color }}
                          />
                        )}
                        <span className="font-medium">{budget.name}</span>
                        {budget.icon && (
                          <span className="text-muted-foreground text-sm">{budget.icon}</span>
                        )}
                        {!budget.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                        {isExceeded && (
                          <Badge variant="destructive" className="text-xs">
                            Exceeded
                          </Badge>
                        )}
                        {alertTriggered && !isExceeded && (
                          <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700 dark:text-yellow-400">
                            Alert
                          </Badge>
                        )}
                      </div>

                      {/* Budget Info */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(budget.amount, budget.currency)}
                        </span>
                        <span>•</span>
                        <Badge variant="outline" className={cn('text-xs', getPeriodBadge(budget.period))}>
                          {budget.period}
                        </Badge>
                        <span>•</span>
                        <span>{formatDate(budget.startDate)}</span>
                        {budget.endDate && (
                          <>
                            <span>-</span>
                            <span>{formatDate(budget.endDate)}</span>
                          </>
                        )}
                        {budget.categoryId && categories.find((c) => c._id === budget.categoryId) && (
                          <>
                            <span>•</span>
                            <span>
                              {categories.find((c) => c._id === budget.categoryId)?.name}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {progress && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span
                              className={cn(
                                'font-semibold',
                                isExceeded && 'text-red-600 dark:text-red-400'
                              )}
                            >
                              {percentageUsed.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={Math.min(percentageUsed, 100)}
                            className={cn(
                              'h-2',
                              isExceeded && '[&>div]:bg-red-500',
                              !isExceeded &&
                                percentageUsed >= (budget.alertThreshold || 80) &&
                                '[&>div]:bg-yellow-500'
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {onViewProgressClick && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewProgressClick(budget)}
                          className="h-8 w-8"
                          title="View Progress"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEditClick && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditClick(budget)}
                          className="h-8 w-8"
                          title="Edit Budget"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDeleteClick && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteClick(budget)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete Budget"
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

        {/* Summary */}
        {budgets.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            Showing {budgets.length} budget{budgets.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

