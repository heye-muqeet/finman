/**
 * Transaction List Component
 * Displays transactions in a table with filters, sorting, and pagination
 */

'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchTransactions,
  setFilters,
  setSorting,
  clearFilters,
  setPage,
  setLimit,
} from '@/lib/store/slices/transactionsSlice';
import { fetchCategories } from '@/lib/store/slices/categoriesSlice';
import TransactionFilters from './TransactionFilters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  SortableTableHead,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Edit,
  Trash2,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Loader2,
  Inbox,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import type { Transaction } from '@/types/transaction.types';
// Using native Date formatting instead of date-fns for now
// Can be replaced with date-fns if package is installed
const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};
import { cn } from '@/lib/utils/cn';

export interface TransactionListProps {
  onEditClick?: (transaction: Transaction) => void;
  onDeleteClick?: (transaction: Transaction) => void;
  className?: string;
}

export default function TransactionList({
  onEditClick,
  onDeleteClick,
  className,
}: TransactionListProps) {
  const dispatch = useAppDispatch();
  const {
    transactions,
    isLoading,
    error,
    page,
    limit,
    total,
    totalPages,
    filters,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.transactions);

  const { categories, isLoading: isLoadingCategories } = useAppSelector(
    (state) => state.categories
  );

  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories({}));
    }
  }, [dispatch, categories.length]);

  // Fetch transactions when filters, pagination, or sorting changes
  // Using JSON.stringify for filters to avoid infinite loops from object reference changes
  useEffect(() => {
    dispatch(fetchTransactions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, JSON.stringify(filters), page, limit, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    const newSortOrder =
      sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: key, sortOrder: newSortOrder }));
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters));
    dispatch(setPage(1)); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
    dispatch(setPage(1));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || 'Unknown';
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatPaymentMethod = (method?: string) => {
    if (!method) return '-';
    return method
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: limit }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  // Empty state
  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={8} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            No transactions found
          </p>
          <p className="text-xs text-muted-foreground">
            {Object.keys(filters).length > 0
              ? 'Try adjusting your filters'
              : 'Create your first transaction to get started'}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
      />

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'table' ? 'compact' : 'table')}
                className="h-8 w-8"
                aria-label={`Switch to ${viewMode === 'table' ? 'compact' : 'table'} view`}
              >
                {viewMode === 'table' ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading spinner overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : transactions.length === 0 ? (
                <div className="py-8 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No transactions found
                  </p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <Card key={transaction._id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {transaction.type === 'income' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </span>
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded',
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            )}
                          >
                            {transaction.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{getCategoryName(transaction.categoryId)}</span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {onEditClick && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEditClick(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteClick && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => onDeleteClick(transaction)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="relative">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead
                        sortable
                        sortKey="date"
                        currentSortKey={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className={viewMode === 'compact' ? 'w-[100px]' : ''}
                      >
                        Date
                      </SortableTableHead>
                      <SortableTableHead
                        sortable
                        sortKey="type"
                        currentSortKey={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className={viewMode === 'compact' ? 'w-[80px]' : ''}
                      >
                        Type
                      </SortableTableHead>
                      <SortableTableHead
                        sortable
                        sortKey="amount"
                        currentSortKey={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className={viewMode === 'compact' ? 'w-[100px]' : ''}
                      >
                        Amount
                      </SortableTableHead>
                      {viewMode === 'table' && (
                        <>
                          <SortableTableHead
                            sortable
                            sortKey="categoryId"
                            currentSortKey={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          >
                            Category
                          </SortableTableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Tags</TableHead>
                        </>
                      )}
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <LoadingSkeleton />
                    ) : transactions.length === 0 ? (
                      <EmptyState />
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell className={viewMode === 'compact' ? 'text-xs' : ''}>
                            {formatDate(transaction.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.type === 'income' ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span
                                className={cn(
                                  'text-xs px-2 py-0.5 rounded font-medium',
                                  transaction.type === 'income'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                )}
                              >
                                {transaction.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </TableCell>
                          {viewMode === 'table' && (
                            <>
                              <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {transaction.description || '-'}
                              </TableCell>
                              <TableCell>{formatPaymentMethod(transaction.paymentMethod)}</TableCell>
                              <TableCell>
                                {transaction.tags && transaction.tags.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {transaction.tags.slice(0, 3).map((tag, i) => (
                                      <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 bg-muted rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {transaction.tags.length > 3 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{transaction.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {onEditClick && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => onEditClick(transaction)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {onDeleteClick && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => onDeleteClick(transaction)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 20, 50, 100]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

