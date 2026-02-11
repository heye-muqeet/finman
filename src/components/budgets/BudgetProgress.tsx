/**
 * Budget Progress Component
 * Displays detailed budget progress including spent amount, remaining, percentage, and alerts
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import type { BudgetProgress as BudgetProgressType, Budget } from '@/types/budget.types';
import { cn } from '@/lib/utils/cn';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface BudgetProgressProps {
  budget: Budget;
  progress: BudgetProgressType;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
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

export default function BudgetProgress({
  budget,
  progress,
  isLoading = false,
  onRefresh,
  className,
}: BudgetProgressProps) {
  const percentageColor = progress.isExceeded
    ? 'bg-red-500'
    : progress.percentageUsed >= (budget.alertThreshold || 80)
    ? 'bg-yellow-500'
    : 'bg-green-500';

  const progressBarColor = progress.isExceeded
    ? 'bg-red-500'
    : progress.percentageUsed >= (budget.alertThreshold || 80)
    ? 'bg-yellow-500'
    : 'bg-blue-500';

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Budget Progress</CardTitle>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className={cn('font-semibold', progress.isExceeded && 'text-red-600 dark:text-red-400')}>
                  {progress.percentageUsed.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.min(progress.percentageUsed, 100)} className="h-3" />
            </div>

            {/* Alert Messages */}
            {progress.alertTriggered && progress.alertMessage && (
              <Alert
                variant={progress.isExceeded ? 'destructive' : 'default'}
                className={cn(
                  progress.alertType === 'threshold' && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                )}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {progress.isExceeded ? 'Budget Exceeded' : 'Alert Threshold Reached'}
                </AlertTitle>
                <AlertDescription>{progress.alertMessage}</AlertDescription>
              </Alert>
            )}

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Budget Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(budget.amount, budget.currency)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p
                  className={cn(
                    'text-lg font-semibold',
                    progress.isExceeded && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {formatCurrency(progress.spent, budget.currency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p
                  className={cn(
                    'text-lg font-semibold',
                    progress.remaining <= 0 && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {formatCurrency(progress.remaining, budget.currency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-semibold">{progress.transactionCount}</p>
              </div>
            </div>

            {/* Period Information */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(progress.startDate)}
                  {progress.endDate && ` - ${formatDate(progress.endDate)}`}
                </span>
              </div>
              {progress.daysRemaining !== null && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {progress.daysRemaining} day{progress.daysRemaining !== 1 ? 's' : ''} remaining
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Period: {progress.periodDays} day{progress.periodDays !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={budget.isActive ? 'default' : 'secondary'}>
                {budget.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">{budget.period}</Badge>
              {progress.isExceeded && (
                <Badge variant="destructive">Exceeded</Badge>
              )}
              {progress.alertTriggered && !progress.isExceeded && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">
                  Alert
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
