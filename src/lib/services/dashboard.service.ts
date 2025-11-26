/**
 * Dashboard Service
 * Handles dashboard data aggregation and summary calculations
 */

import { Types } from 'mongoose';
import { connectDB } from '@/lib/database/connection';
import { getUserStats } from '@/lib/services/transactions.service';
import { getTransactions } from '@/lib/services/transactions.service';
import { loggerService } from '@/lib/services/logger.service';
import type { TransactionFilters } from '@/types/transaction.types';

/**
 * Dashboard summary data
 */
export interface DashboardSummary {
  // Financial overview
  totalIncome: number;
  totalExpense: number;
  balance: number; // income - expense
  currency: string;
  
  // Period-specific stats
  thisMonth: {
    income: number;
    expense: number;
    net: number;
  };
  
  // Transaction counts
  totalTransactions: number;
  incomeCount: number;
  expenseCount: number;
  
  // Recent transactions (last 5)
  recentTransactions: Array<{
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    currency: string;
    description?: string;
    date: Date;
    categoryId: string;
  }>;
}

/**
 * Get dashboard summary for a user
 * @param userId - User ID
 * @param currency - User's preferred currency (default: USD)
 * @returns Dashboard summary data
 */
export async function getDashboardSummary(
  userId: string,
  currency: string = 'USD'
): Promise<DashboardSummary> {
  await connectDB();

  try {
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get overall statistics (all time)
    const overallStats = await getUserStats(userId);

    // Get this month's statistics
    const thisMonthStats = await getUserStats(userId, startOfMonth, endOfMonth);

    // Get recent transactions (last 5)
    const recentTransactionsResult = await getTransactions(userId, {
      filters: {},
      page: 1,
      limit: 5,
      sortBy: 'date',
      sortOrder: 'desc',
    });

    // Calculate balance (total income - total expense)
    const balance = (overallStats.income?.total || 0) - (overallStats.expense?.total || 0);

    const summary: DashboardSummary = {
      totalIncome: overallStats.income?.total || 0,
      totalExpense: overallStats.expense?.total || 0,
      balance,
      currency,
      thisMonth: {
        income: thisMonthStats.income?.total || 0,
        expense: thisMonthStats.expense?.total || 0,
        net: (thisMonthStats.income?.total || 0) - (thisMonthStats.expense?.total || 0),
      },
      totalTransactions: overallStats.totalTransactions || 0,
      incomeCount: overallStats.income?.count || 0,
      expenseCount: overallStats.expense?.count || 0,
      recentTransactions: recentTransactionsResult.transactions.slice(0, 5).map((tx) => ({
        _id: tx._id,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        description: tx.description,
        date: tx.date,
        categoryId: tx.categoryId,
      })),
    };

    loggerService.logDatabase('FIND', 'dashboard', {
      userId,
      summaryGenerated: true,
    });

    return summary;
  } catch (error) {
    loggerService.error('Failed to get dashboard summary', error, { userId });
    throw error;
  }
}

