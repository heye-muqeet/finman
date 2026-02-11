/**
 * Goal Form Component
 * Form for creating and editing goals
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createGoalSchema,
  updateGoalSchemaWithPreprocess,
  type CreateGoalInput,
  type UpdateGoalInput,
} from '@/lib/validators/goal.validator';
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
import type { Goal, GoalCategory, GoalStatus } from '@/types/goal.types';
import { ErrorMessage } from '@/components/ui/error-message';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface GoalFormProps {
  onSubmit: (data: CreateGoalInput | UpdateGoalInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  initialData?: Goal | null;
  mode?: 'create' | 'edit';
}

// Common currencies
const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];

export default function GoalForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  initialData,
  mode = 'create',
}: GoalFormProps) {
  const isEditMode = mode === 'edit' && !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateGoalInput | UpdateGoalInput>({
    resolver: zodResolver(isEditMode ? updateGoalSchemaWithPreprocess : createGoalSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || undefined,
      targetAmount: initialData?.targetAmount || 0,
      currentAmount: initialData?.currentAmount || 0,
      currency: initialData?.currency || 'USD',
      targetDate: initialData?.targetDate ? new Date(initialData.targetDate) : undefined,
      category: initialData?.category || 'savings',
      status: initialData?.status || 'active',
      isCompleted: initialData?.isCompleted || false,
      color: initialData?.color || undefined,
      icon: initialData?.icon || undefined,
    },
  });

  const selectedCategory = watch('category');
  const selectedStatus = watch('status');
  const targetDate = watch('targetDate');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const onSubmitForm = async (data: CreateGoalInput | UpdateGoalInput) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Goal Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Goal Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Emergency Fund"
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="title" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Add a description for your goal"
          rows={3}
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="description" />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) =>
            setValue('category', value as GoalCategory, { shouldValidate: true })
          }
          disabled={isLoading}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="savings">Savings</SelectItem>
            <SelectItem value="debt_payoff">Debt Payoff</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <ErrorMessage errors={errors} name="category" />
      </div>

      {/* Target Amount */}
      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount *</Label>
        <Input
          id="targetAmount"
          type="number"
          step="0.01"
          min="0.01"
          {...register('targetAmount', { valueAsNumber: true })}
          placeholder="0.00"
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="targetAmount" />
      </div>

      {/* Current Amount */}
      <div className="space-y-2">
        <Label htmlFor="currentAmount">Current Amount</Label>
        <Input
          id="currentAmount"
          type="number"
          step="0.01"
          min="0"
          {...register('currentAmount', { valueAsNumber: true })}
          placeholder="0.00"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          How much you've saved so far (optional, defaults to 0)
        </p>
        <ErrorMessage errors={errors} name="currentAmount" />
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

      {/* Target Date */}
      <div className="space-y-2">
        <Label htmlFor="targetDate">Target Date (Optional)</Label>
        <DatePicker
          date={targetDate}
          onDateChange={(date) => setValue('targetDate', date || undefined, { shouldValidate: true })}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          When you want to achieve this goal (optional)
        </p>
        <ErrorMessage errors={errors} name="targetDate" />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={selectedStatus}
          onValueChange={(value) =>
            setValue('status', value as GoalStatus, { shouldValidate: true })
          }
          disabled={isLoading}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <ErrorMessage errors={errors} name="status" />
      </div>

      {/* Is Completed */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCompleted"
          checked={watch('isCompleted')}
          onCheckedChange={(checked) =>
            setValue('isCompleted', checked === true, { shouldValidate: true })
          }
          disabled={isLoading}
        />
        <Label htmlFor="isCompleted" className="text-sm font-normal cursor-pointer">
          Mark as completed
        </Label>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color (Optional)</Label>
        <ColorPicker
          selectedColor={selectedColor || undefined}
          onColorChange={(color) => setValue('color', color || undefined, { shouldValidate: true })}
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="color" />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label>Icon (Optional)</Label>
        <IconPicker
          selectedIcon={selectedIcon || undefined}
          onIconChange={(icon) => setValue('icon', icon || undefined, { shouldValidate: true })}
          disabled={isLoading}
        />
        <ErrorMessage errors={errors} name="icon" />
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
          {isEditMode ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
}

