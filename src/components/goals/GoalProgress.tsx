/**
 * Goal Progress Component
 * Displays detailed goal progress including current amount, remaining, percentage, and estimated completion date
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, TrendingUp, Calendar, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import type { GoalProgress as GoalProgressType, Goal } from '@/types/goal.types';
import { cn } from '@/lib/utils/cn';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface GoalProgressProps {
  goal: Goal;
  progress: GoalProgressType;
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

const formatDate = (date: Date | string | null) => {
  if (!date) return 'Not set';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function GoalProgress({
  goal,
  progress,
  isLoading = false,
  onRefresh,
  className,
}: GoalProgressProps) {
  const progressBarColor = progress.isCompleted
    ? 'bg-green-500'
    : progress.isOverdue
    ? 'bg-red-500'
    : progress.percentageComplete >= 75
    ? 'bg-yellow-500'
    : 'bg-blue-500';

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {goal.icon && (
              <span className="text-3xl" style={{ color: goal.color || undefined }}>
                {goal.icon}
              </span>
            )}
            <div>
              <CardTitle className="text-2xl">{goal.title}</CardTitle>
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
              )}
            </div>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress.percentageComplete.toFixed(1)}%</span>
          </div>
          <Progress value={progress.percentageComplete} className={cn('h-3', progressBarColor)} />
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current Amount</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(progress.currentAmount, goal.currency)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Target Amount</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(progress.targetAmount, goal.currency)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Remaining</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(progress.remaining, goal.currency)}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Days Elapsed</span>
            </div>
            <p className="text-2xl font-bold">{progress.daysElapsed}</p>
          </div>
        </div>

        {/* Goal Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Goal Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium capitalize">{goal.category.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium capitalize">{goal.status}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Target Date:</span>
              <p className="font-medium">{formatDate(goal.targetDate)}</p>
            </div>
            {progress.daysRemaining !== null && (
              <div>
                <span className="text-muted-foreground">Days Remaining:</span>
                <p className="font-medium">
                  {progress.daysRemaining > 0 ? `${progress.daysRemaining} days` : 'Past due date'}
                </p>
              </div>
            )}
            {progress.estimatedCompletionDate && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Estimated Completion:</span>
                <p className="font-medium">{formatDate(progress.estimatedCompletionDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {progress.isCompleted && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">Goal Completed!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Congratulations! You've reached your target amount of{' '}
              {formatCurrency(progress.targetAmount, goal.currency)}.
            </AlertDescription>
          </Alert>
        )}

        {progress.isOverdue && !progress.isCompleted && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Goal Overdue</AlertTitle>
            <AlertDescription>
              Your target date has passed, but you haven't reached your goal yet. Keep working towards it!
            </AlertDescription>
          </Alert>
        )}

        {progress.percentageComplete >= 75 && !progress.isCompleted && !progress.isOverdue && (
          <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">Almost There!</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              You're {progress.percentageComplete.toFixed(1)}% of the way to your goal. Keep it up!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

