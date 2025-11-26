/**
 * Budget Progress Component
 * Displays detailed budget progress including spent amount, remaining, percentage, and alerts
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
  Calendar,
  Target,
} from 'lucide-react';
import type { BudgetProgress as BudgetProgressType, Budget } from '@/types/budget.types';
import { cn } from '@/lib/utils/cn';

interface BudgetProgressProps {
  budget: Budget;
  progress: BudgetProgressType | null;
  isLoading?: boolean;
  className?: string;
}

export default function BudgetProgress({
  budget,
  progress,
  isLoading = false,
  className,
}: BudgetProgressProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>Progress data not available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budget.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = () => {
    if (progress.isExceeded) return 'bg-destructive';
    if (progress.alertTriggered && progress.alertType === 'threshold') {
      return 'bg-yellow-500';
    }
    if (progress.percentageUsed >= 80) return 'bg-yellow-500';
    return 'bg-primary';
  };

  const getProgressVariant = () => {
    if (progress.isExceeded) return 'destructive';
    if (progress.alertTriggered) return 'default';
    return 'default';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget Progress</CardTitle>
          {progress.alertTriggered && (
            <Badge
              variant={progress.isExceeded ? 'destructive' : 'default'}
              className="flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {progress.isExceeded ? 'Exceeded' : 'Alert'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {progress.percentageUsed.toFixed(1)}% used
            </span>
          </div>
          <Progress
            value={Math.min(progress.percentageUsed, 100)}
            className="h-3"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(budget.amount)}</span>
          </div>
        </div>

        {/* Alert Message */}
        {progress.alertTriggered && progress.alertMessage && (
          <Alert
            variant={progress.isExceeded ? 'destructive' : 'default'}
            className={cn(
              progress.isExceeded
                ? 'border-destructive'
                : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
            )}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{progress.alertMessage}</AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Spent</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(progress.spent)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Remaining</span>
            </div>
            <div
              className={cn(
                'text-2xl font-bold',
                progress.remaining < 0
                  ? 'text-destructive'
                  : progress.remaining < budget.amount * 0.2
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-primary'
              )}
            >
              {formatCurrency(progress.remaining)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Period</span>
            </div>
            <div className="text-sm font-medium">
              {formatDate(progress.startDate)}
              {progress.endDate && ` - ${formatDate(progress.endDate)}`}
            </div>
            {progress.daysRemaining !== null && (
              <div className="text-xs text-muted-foreground">
                {progress.daysRemaining} days remaining
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Transactions</span>
            </div>
            <div className="text-2xl font-bold">
              {progress.transactionCount}
            </div>
          </div>
        </div>

        {/* Budget Details */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget Amount</span>
            <span className="font-medium">{formatCurrency(budget.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Period</span>
            <span className="font-medium capitalize">{budget.period}</span>
          </div>
          {budget.alertThreshold !== null && budget.alertThreshold !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Alert Threshold</span>
              <span className="font-medium">{budget.alertThreshold}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

