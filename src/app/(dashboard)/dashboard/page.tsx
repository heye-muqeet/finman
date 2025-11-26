/**
 * Dashboard Page
 * Main dashboard page with financial overview
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { DashboardSummary } from '@/lib/services/dashboard.service';

export default function DashboardPage() {
  const { user, token } = useAppSelector((state) => state.auth);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return 'User';
  };

  // Fetch dashboard summary (memoized to avoid unnecessary re-renders)
  const fetchDashboardSummary = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/v1/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch dashboard data');
      }

      const data = await response.json();
      setSummary(data.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Initial fetch and refresh on token change
  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  // Auto-refresh when page becomes visible (user navigates back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && token) {
        // Refresh data when page becomes visible (user switched back to tab)
        fetchDashboardSummary();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, fetchDashboardSummary]);

  // Refresh on window focus (user switches back to window)
  useEffect(() => {
    const handleFocus = () => {
      if (token && !isLoading) {
        // Refresh data when window gains focus
        fetchDashboardSummary();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, isLoading, fetchDashboardSummary]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {getUserDisplayName()}!</h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your finances
          </p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Default values if no summary
  const displaySummary = summary || {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    currency: user?.currency || 'USD',
    thisMonth: { income: 0, expense: 0, net: 0 },
    totalTransactions: 0,
    incomeCount: 0,
    expenseCount: 0,
    recentTransactions: [],
  };

  const hasTransactions = displaySummary.totalTransactions > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {getUserDisplayName()}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your finances
        </p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(displaySummary.balance, displaySummary.currency)}
          description={hasTransactions ? 'Income - Expenses' : 'No transactions yet'}
          icon={Wallet}
          variant="balance"
        />

        <SummaryCard
          title="Total Income"
          value={formatCurrency(displaySummary.totalIncome, displaySummary.currency)}
          description={`${displaySummary.incomeCount} income transaction${displaySummary.incomeCount !== 1 ? 's' : ''}`}
          icon={TrendingUp}
          variant="income"
          trend={
            displaySummary.thisMonth.income > 0
              ? {
                  value: displaySummary.thisMonth.income,
                  label: 'this month',
                  isPositive: true,
                }
              : undefined
          }
        />

        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(displaySummary.totalExpense, displaySummary.currency)}
          description={`${displaySummary.expenseCount} expense transaction${displaySummary.expenseCount !== 1 ? 's' : ''}`}
          icon={TrendingDown}
          variant="expense"
          trend={
            displaySummary.thisMonth.expense > 0
              ? {
                  value: displaySummary.thisMonth.expense,
                  label: 'this month',
                  isPositive: false,
                }
              : undefined
          }
        />

        <SummaryCard
          title="This Month"
          value={formatCurrency(displaySummary.thisMonth.net, displaySummary.currency)}
          description={
            displaySummary.thisMonth.net >= 0
              ? 'Net income this month'
              : 'Net expense this month'
          }
          icon={DollarSign}
          variant={displaySummary.thisMonth.net >= 0 ? 'income' : 'expense'}
        />
      </div>

      {/* Recent Transactions & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            {hasTransactions && (
              <Link href="/transactions">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {!hasTransactions ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No transactions yet. Start tracking your finances!
                </p>
                <Link href="/transactions">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </Link>
              </div>
            ) : displaySummary.recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent transactions to display.
              </p>
            ) : (
              <div className="space-y-3">
                {displaySummary.recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {transaction.description || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
                {displaySummary.recentTransactions.length < displaySummary.totalTransactions && (
                  <Link href="/transactions">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All Transactions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/transactions">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </Link>
              <Link href="/transactions">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View All Transactions
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
