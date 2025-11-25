/**
 * Transaction Filters Component
 * Collapsible filter panel with all filter options
 */

'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TransactionFilters as TransactionFiltersType } from '@/types/transaction.types';
import { cn } from '@/lib/utils/cn';

export interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFiltersChange: (filters: TransactionFiltersType) => void;
  onClearFilters: () => void;
  categories?: Array<{ _id: string; name: string; type: string }>;
  isLoadingCategories?: boolean;
  className?: string;
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  categories = [],
  isLoadingCategories = false,
  className,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<TransactionFiltersType>(filters);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    localFilters.type ||
    localFilters.categoryId ||
    localFilters.minAmount ||
    localFilters.maxAmount ||
    localFilters.startDate ||
    localFilters.endDate ||
    localFilters.paymentMethod ||
    (localFilters.tags && localFilters.tags.length > 0) ||
    localFilters.search
  );

  const updateFilter = (key: keyof TransactionFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: TransactionFiltersType = {};
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  const incomeCategories = categories.filter((cat) => cat.type === 'income' || cat.type === 'both');
  const expenseCategories = categories.filter((cat) => cat.type === 'expense' || cat.type === 'both');

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8"
              aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4 pt-0">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search in descriptions and tags..."
              value={localFilters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value || undefined)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={localFilters.type || 'all'}
                onValueChange={(value) =>
                  updateFilter('type', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={localFilters.categoryId || 'all'}
                onValueChange={(value) =>
                  updateFilter('categoryId', value === 'all' ? undefined : value)
                }
                disabled={isLoadingCategories}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {localFilters.type === 'income' || !localFilters.type
                    ? incomeCategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    : expenseCategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={localFilters.paymentMethod || 'all'}
                onValueChange={(value) =>
                  updateFilter('paymentMethod', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Amount */}
            <div className="space-y-2">
              <Label htmlFor="minAmount">Min Amount</Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={localFilters.minAmount || ''}
                onChange={(e) =>
                  updateFilter(
                    'minAmount',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>

            {/* Max Amount */}
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Max Amount</Label>
              <Input
                id="maxAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={localFilters.maxAmount || ''}
                onChange={(e) =>
                  updateFilter(
                    'maxAmount',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={
                  localFilters.startDate
                    ? new Date(localFilters.startDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  updateFilter(
                    'startDate',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={
                  localFilters.endDate
                    ? new Date(localFilters.endDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  updateFilter(
                    'endDate',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>

          {/* Tags Filter (Simple input for now, can be enhanced with tag selector) */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., groceries, food, travel"
              value={localFilters.tags?.join(', ') || ''}
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                updateFilter('tags', tags.length > 0 ? tags : undefined);
              }}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

