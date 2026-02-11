/**
 * Budget Form Component
 * Form for creating and editing budgets
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBudgetSchema,
  updateBudgetSchema,
  type CreateBudgetInput,
  type UpdateBudgetInput,
} from '@/lib/validators/budget.validator';
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import ColorPicker from '@/components/categories/ColorPicker';
import IconPicker from '@/components/categories/IconPicker';
import type { Budget, BudgetPeriod } from '@/types/budget.types';
import type { Category } from '@/types/category.types';
import { ErrorMessage } from '@/components/ui/error-message';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface BudgetFormProps {
  onSubmit: (data: CreateBudgetInput | UpdateBudgetInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  initialData?: Budget | null;
  categories?: Category[];
  mode?: 'create' | 'edit';
}

// Common currencies
const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];

export default function BudgetForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  initialData,
  categories = [],
  mode = 'create',
}: BudgetFormProps) {
  const isEditMode = mode === 'edit' && !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBudgetInput | UpdateBudgetInput>({
    resolver: zodResolver(isEditMode ? updateBudgetSchema : createBudgetSchema),
    defaultValues: {
      name: initialData?.name || '',
      categoryId: initialData?.categoryId || undefined,
      amount: initialData?.amount || 0,
      currency: initialData?.currency || 'USD',
      period: initialData?.period || 'monthly',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      alertThreshold: initialData?.alertThreshold || undefined,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      description: initialData?.description || undefined,
      color: initialData?.color || undefined,
      icon: initialData?.icon || undefined,
    },
  });

  const selectedCategoryId = watch('categoryId');
  const selectedPeriod = watch('period');
  const startDate = watch('startDate');

  // Filter categories to only show expense categories (budgets are for expenses)
  const expenseCategories = categories.filter((cat) => cat.type === 'expense' || cat.type === 'both');

  const onSubmitForm = async (data: CreateBudgetInput | UpdateBudgetInput) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Budget Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Budget Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Monthly Groceries"
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="name" />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category (Optional)</Label>
        <Select
          value={selectedCategoryId || 'none'}
          onValueChange={(value) =>
            setValue('categoryId', value === 'none' ? undefined : value, { shouldValidate: true })
          }
          disabled={isLoading}
        >
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="Select category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (General Budget)</SelectItem>
            {expenseCategories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMessage errors={errors} name="categoryId" />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Budget Amount *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          {...register('amount', { valueAsNumber: true })}
          placeholder="0.00"
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="amount" />
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="currency">Currency *</Label>
        <Select
          value={watch('currency')}
          onValueChange={(value) => setValue('currency', value, { shouldValidate: true })}
          disabled={isLoading}
        >
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {COMMON_CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMessage errors={errors} name="currency" />
      </div>

      {/* Period */}
      <div className="space-y-2">
        <Label htmlFor="period">Budget Period *</Label>
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setValue('period', value as BudgetPeriod, { shouldValidate: true })}
          disabled={isLoading}
        >
          <SelectTrigger id="period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <ErrorMessage errors={errors} name="period" />
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date *</Label>
        <DatePicker
          value={startDate}
          onChange={(date) => setValue('startDate', date || new Date(), { shouldValidate: true })}
          disabled={isLoading}
          required
        />
        <ErrorMessage errors={errors} name="startDate" />
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="endDate">End Date (Optional)</Label>
        <DatePicker
          value={watch('endDate')}
          onChange={(date) => setValue('endDate', date || undefined, { shouldValidate: true })}
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Leave empty for recurring budgets. If set, must be after start date.
        </p>
        <ErrorMessage errors={errors} name="endDate" />
      </div>

      {/* Alert Threshold */}
      <div className="space-y-2">
        <Label htmlFor="alertThreshold">Alert Threshold (Optional)</Label>
        <Input
          id="alertThreshold"
          type="number"
          step="1"
          min="0"
          max="100"
          {...register('alertThreshold', { valueAsNumber: true })}
          placeholder="e.g., 80 (for 80%)"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Percentage (0-100) at which to trigger an alert when budget usage reaches this threshold.
        </p>
        <ErrorMessage errors={errors} name="alertThreshold" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Add a description for this budget..."
          rows={3}
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="description" />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label>Icon (Optional)</Label>
        <IconPicker
          value={watch('icon') || undefined}
          onChange={(icon) => setValue('icon', icon ?? undefined, { shouldValidate: true })}
        />
        <ErrorMessage errors={errors} name="icon" />
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color (Optional)</Label>
        <ColorPicker
          value={watch('color') || undefined}
          onChange={(color) => setValue('color', color ?? undefined, { shouldValidate: true })}
        />
        <ErrorMessage errors={errors} name="color" />
      </div>

      {/* Is Active */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={watch('isActive')}
          onCheckedChange={(checked) => setValue('isActive', checked === true, { shouldValidate: true })}
          disabled={isLoading}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Active Budget
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : null}
          {isLoading ? 'Saving...' : isEditMode ? 'Update Budget' : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
}

