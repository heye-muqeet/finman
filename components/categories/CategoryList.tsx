/**
 * Category List Component
 * Displays a list of categories with filtering options
 */

'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
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
import type { Category, CategoryType } from '@/types/category.types';

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
  onCreateClick?: () => void;
  onEditClick?: (category: Category) => void;
  onDeleteClick?: (category: Category) => void;
  onTypeFilterChange?: (type: CategoryType | 'all') => void;
  selectedType?: CategoryType | 'all';
}

export default function CategoryList({
  categories,
  isLoading = false,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onTypeFilterChange,
  selectedType = 'all',
}: CategoryListProps) {
  const [localTypeFilter, setLocalTypeFilter] = useState<CategoryType | 'all'>(selectedType);

  const handleTypeFilterChange = (value: string) => {
    const newFilter = value as CategoryType | 'all';
    setLocalTypeFilter(newFilter);
    onTypeFilterChange?.(newFilter);
  };

  const filteredCategories = categories.filter((category) => {
    if (localTypeFilter === 'all') return true;
    return category.type === localTypeFilter || category.type === 'both';
  });

  const getCategoryTypeColor = (type: CategoryType) => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'both':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getCategoryTypeBadge = (type: CategoryType) => {
    switch (type) {
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expense';
      case 'both':
        return 'Both';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage your income and expense categories
            </CardDescription>
          </div>
          <Button onClick={onCreateClick} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter */}
        {onTypeFilterChange && (
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={localTypeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No categories found.</p>
            {onCreateClick && (
              <Button
                variant="link"
                onClick={onCreateClick}
                className="mt-2"
              >
                Create your first category
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Color indicator */}
                  {category.color && (
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  
                  {/* Category info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.name}</span>
                      {category.icon && (
                        <span className="text-muted-foreground">{category.icon}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-medium ${getCategoryTypeColor(category.type)}`}
                      >
                        {getCategoryTypeBadge(category.type)}
                      </span>
                      {category.isDefault && (
                        <span className="text-xs text-muted-foreground">
                          • Default
                        </span>
                      )}
                      {category.parentCategoryId && (
                        <span className="text-xs text-muted-foreground">
                          • Subcategory
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {onEditClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditClick(category)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteClick(category)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        )}
      </CardContent>
    </Card>
  );
}

