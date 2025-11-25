/**
 * Category Form Component
 * Form for creating and editing categories
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategorySchema, type CreateCategoryInput } from '@/lib/validators/category.validator';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import ColorPicker from '@/components/categories/ColorPicker';
import IconPicker from '@/components/categories/IconPicker';
import type { Category } from '@/types/category.types';

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  initialData?: Category | null;
  parentCategories?: Category[];
}

export default function CategoryForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  initialData,
  parentCategories = [],
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'expense',
      icon: initialData?.icon || undefined,
      color: initialData?.color || undefined,
      parentCategoryId: initialData?.parentCategoryId || undefined,
      isDefault: initialData?.isDefault || false,
    },
  });

  const selectedType = watch('type');

  // Filter parent categories based on selected type
  const availableParents = parentCategories.filter(
    (cat) => cat.type === selectedType || cat.type === 'both'
  );

  const onSubmitForm = async (data: CreateCategoryInput) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Food & Dining"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Category Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Category Type *</Label>
        <Select
          value={watch('type')}
          onValueChange={(value) => setValue('type', value as 'income' | 'expense' | 'both')}
          disabled={isLoading}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select category type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* Parent Category */}
      {availableParents.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="parentCategoryId">Parent Category (Optional)</Label>
          <Select
            value={watch('parentCategoryId') || 'none'}
            onValueChange={(value) =>
              setValue('parentCategoryId', value === 'none' ? undefined : value)
            }
            disabled={isLoading}
          >
            <SelectTrigger id="parentCategoryId">
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {availableParents.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.parentCategoryId && (
            <p className="text-sm text-destructive">
              {errors.parentCategoryId.message}
            </p>
          )}
        </div>
      )}

      {/* Icon */}
      <div className="space-y-2">
        <Label>Icon (Optional)</Label>
        <IconPicker
          value={watch('icon') || undefined}
          onChange={(icon) => setValue('icon', icon || '', { shouldValidate: true })}
        />
        {errors.icon && (
          <p className="text-sm text-destructive">{errors.icon.message}</p>
        )}
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color (Optional)</Label>
        <ColorPicker
          value={watch('color') || undefined}
          onChange={(color) => setValue('color', color || '', { shouldValidate: true })}
        />
        {errors.color && (
          <p className="text-sm text-destructive">{errors.color.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}

