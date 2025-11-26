/**
 * Transaction Form Component
 * Form for creating and editing transactions with all fields
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTransactionSchema,
  updateTransactionSchema,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from '@/lib/validators/transaction.validator';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  createTransaction,
  updateTransaction,
  saveFormDraft,
  clearFormDraft,
  resetFormState,
} from '@/lib/store/slices/transactionsSlice';
import { fetchCategories } from '@/lib/store/slices/categoriesSlice';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { TagInput } from '@/components/ui/tag-input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Transaction } from '@/types/transaction.types';
import type { Category } from '@/types/category.types';
import { cn } from '@/lib/utils/cn';
import { Save, X, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  initialData?: Transaction | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  className?: string;
  showCard?: boolean; // Whether to show the Card wrapper (default: true)
}

// Common currencies
const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];

export default function TransactionForm({
  initialData,
  onSuccess,
  onCancel,
  mode = 'create',
  className,
  showCard = true,
}: TransactionFormProps) {
  const dispatch = useAppDispatch();
  const {
    isCreating,
    isUpdating,
    error,
    formDraft,
    categories: categoriesFromState,
  } = useAppSelector((state) => ({
    isCreating: state.transactions.isCreating,
    isUpdating: state.transactions.isUpdating,
    error: state.transactions.error,
    formDraft: state.transactions.formDraft,
    categories: state.categories.categories,
  }));

  const [allTags, setAllTags] = useState<string[]>([]);
  const isUpdatingRecurringPatternRef = useRef(false);

  const isEditMode = mode === 'edit' && !!initialData;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(
      (isEditMode ? updateTransactionSchema : createTransactionSchema) as any
    ) as any,
    defaultValues: formDraft || {
      type: initialData?.type || 'expense',
      amount: initialData?.amount || undefined,
      currency: initialData?.currency || 'USD',
      categoryId: initialData?.categoryId || undefined,
      description: initialData?.description || undefined,
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      paymentMethod: initialData?.paymentMethod || undefined,
      tags: initialData?.tags || [],
      location: initialData?.location || undefined,
      receiptId: initialData?.receiptId || undefined,
      isRecurring: initialData?.isRecurring || false,
      recurringPattern: initialData?.recurringPattern || undefined,
    },
  });

  const selectedType = watch('type');
  const selectedCategoryId = watch('categoryId');
  const isRecurring = watch('isRecurring');

  // Fetch categories on mount
  useEffect(() => {
    if (categoriesFromState.length === 0) {
      dispatch(fetchCategories({}));
    }
  }, [dispatch, categoriesFromState.length]);

  // Extract all tags from transactions for suggestions
  useEffect(() => {
    const tags = new Set<string>();
    // This would ideally come from a tags endpoint or be extracted from transactions
    // For now, we'll use an empty array and let users add tags
    setAllTags(Array.from(tags));
  }, []);

  // Filter categories based on transaction type
  const filteredCategories = categoriesFromState.filter(
    (category) =>
      category.type === selectedType || category.type === 'both'
  );

  // Save draft on unmount (only if form is dirty)
  useEffect(() => {
    return () => {
      // Check isDirty at unmount time, not at effect creation time
      const currentValues = getValues();
      const formIsDirty = Object.keys(currentValues).some((key) => {
        const value = currentValues[key as keyof typeof currentValues];
        return value !== undefined && value !== null && value !== '';
      });
      
      if (formIsDirty) {
        // Convert Date objects to ISO strings for Redux serialization
        const serializableData = { ...currentValues } as any;
        if (serializableData.date instanceof Date) {
          serializableData.date = serializableData.date.toISOString();
        }
        if (serializableData.recurringPattern?.endDate instanceof Date) {
          serializableData.recurringPattern.endDate = serializableData.recurringPattern.endDate.toISOString();
        }
        if (serializableData.recurringPattern?.nextOccurrence instanceof Date) {
          serializableData.recurringPattern.nextOccurrence = serializableData.recurringPattern.nextOccurrence.toISOString();
        }
        dispatch(saveFormDraft(serializableData as Partial<CreateTransactionInput>));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount, not on every render

  // Load draft on mount if available (only once)
  const draftLoadedRef = useRef(false);
  useEffect(() => {
    if (formDraft && !initialData && !draftLoadedRef.current) {
      draftLoadedRef.current = true;
      Object.entries(formDraft).forEach(([key, value]) => {
        // Convert ISO strings back to Date objects
        if (key === 'date' && typeof value === 'string') {
          setValue(key as keyof CreateTransactionInput, new Date(value) as any, { shouldDirty: false });
        } else if (key === 'recurringPattern' && value && typeof value === 'object') {
          const pattern = value as any;
          const convertedPattern = { ...pattern };
          if (pattern.endDate && typeof pattern.endDate === 'string') {
            convertedPattern.endDate = new Date(pattern.endDate);
          }
          if (pattern.nextOccurrence && typeof pattern.nextOccurrence === 'string') {
            convertedPattern.nextOccurrence = new Date(pattern.nextOccurrence);
          }
          setValue(key as keyof CreateTransactionInput, convertedPattern as any, { shouldDirty: false });
        } else {
          setValue(key as keyof CreateTransactionInput, value as any, { shouldDirty: false });
        }
      });
    }
  }, [formDraft, initialData, setValue]);

  const onSubmit = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    try {
      if (isEditMode && initialData) {
        await dispatch(updateTransaction({ transactionId: initialData._id, data: data as UpdateTransactionInput })).unwrap();
      } else {
        await dispatch(createTransaction(data as CreateTransactionInput)).unwrap();
      }
      
      // Clear form draft on success
      dispatch(clearFormDraft());
      reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by Redux state
      console.error('Transaction form error:', error);
    }
  };

  const handleCancel = () => {
    dispatch(resetFormState());
    reset();
    onCancel?.();
  };

  const selectedCategory = categoriesFromState.find((cat) => cat._id === selectedCategoryId);

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Transaction Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset category when type changes (use setTimeout to avoid immediate re-render)
                    const currentCategoryId = getValues('categoryId');
                    if (currentCategoryId) {
                      setTimeout(() => {
                        setValue('categoryId', undefined as any, { shouldDirty: false });
                      }, 0);
                    }
                  }}
                  disabled={isLoading || isEditMode}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="999999999.99"
                {...register('amount', { valueAsNumber: true })}
                disabled={isLoading}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">
                Currency <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      id="currency"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().slice(0, 3);
                        field.onChange(value);
                      }}
                      disabled={isLoading}
                      placeholder="USD"
                      maxLength={3}
                      className="uppercase"
                    />
                    <div className="mt-1 flex flex-wrap gap-1">
                      {COMMON_CURRENCIES.map((currency) => (
                        <button
                          key={currency}
                          type="button"
                          onClick={() => field.onChange(currency)}
                          className="text-xs px-2 py-0.5 rounded border hover:bg-accent"
                        >
                          {currency}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Category <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={isLoading || filteredCategories.length === 0}
                >
                  <SelectTrigger id="categoryId" className="w-full">
                    {selectedCategory ? (
                      <div className="flex items-center gap-2">
                        {selectedCategory.icon && (
                          <span className="text-base" aria-hidden="true">{selectedCategory.icon}</span>
                        )}
                        {selectedCategory.color && (
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: selectedCategory.color }}
                            aria-hidden="true"
                          />
                        )}
                        <span>{selectedCategory.name}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select category" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    ) : (
                      filteredCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          <div className="flex items-center gap-2">
                            {category.icon && (
                              <span className="text-base" aria-hidden="true">{category.icon}</span>
                            )}
                            {category.color && (
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: category.color }}
                                aria-hidden="true"
                              />
                            )}
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
            {filteredCategories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories available for {selectedType} transactions. Please create a category first.
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  label="Date"
                  required
                  showTime={false}
                  showPresets={true}
                  disabled={isLoading}
                  error={errors.date?.message}
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              disabled={isLoading}
              placeholder="Add a description..."
              rows={3}
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={(tags) => field.onChange(tags)}
                  suggestions={allTags}
                  placeholder="Add tags..."
                  maxTags={20}
                  maxLength={50}
                  disabled={isLoading}
                  label="Tags"
                  error={errors.tags?.message}
                />
              )}
            />
          </div>

          {/* Location */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-medium">Location (Optional)</h3>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={field.value?.latitude || ''}
                        onChange={(e) =>
                          field.onChange({
                            ...field.value,
                            latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        disabled={isLoading}
                        placeholder="-90 to 90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={field.value?.longitude || ''}
                        onChange={(e) =>
                          field.onChange({
                            ...field.value,
                            longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        disabled={isLoading}
                        placeholder="-180 to 180"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={field.value?.address || ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          address: e.target.value || undefined,
                        })
                      }
                      disabled={isLoading}
                      placeholder="Street address"
                      maxLength={500}
                    />
                  </div>
                </div>
              )}
            />
          </div>

          {/* Recurring Transaction */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="isRecurring"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isRecurring"
                    checked={field.value || false}
                    onCheckedChange={(checked: boolean) => field.onChange(checked)}
                    disabled={isLoading}
                  />
                )}
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                This is a recurring transaction
              </Label>
            </div>

            {isRecurring && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">
                    Frequency <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="recurringPattern.frequency"
                    control={control}
                    render={({ field }) => {
                      const handleFrequencyChange = (value: string) => {
                        // Prevent infinite loops
                        if (isUpdatingRecurringPatternRef.current) return;
                        if (field.value === value) return; // No change needed
                        
                        isUpdatingRecurringPatternRef.current = true;
                        
                        // Get current pattern and update only frequency
                        const currentPattern = getValues('recurringPattern') || {};
                        const newPattern = {
                          ...currentPattern,
                          frequency: value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                        };
                        
                        // Use setValue for the entire recurringPattern object
                        setValue('recurringPattern', newPattern, { 
                          shouldValidate: true,
                          shouldDirty: true 
                        });
                        
                        // Reset flag
                        setTimeout(() => {
                          isUpdatingRecurringPatternRef.current = false;
                        }, 50);
                      };
                      
                      return (
                        <Select
                          value={field.value || ''}
                          onValueChange={handleFrequencyChange}
                          disabled={isLoading}
                        >
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      );
                    }}
                  />
                  {errors.recurringPattern?.frequency && (
                    <p className="text-sm text-destructive">
                      {errors.recurringPattern.frequency.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Controller
                    name="recurringPattern.endDate"
                    control={control}
                    render={({ field }) => {
                      const handleEndDateChange = (date: Date | undefined) => {
                        // Prevent infinite loops
                        if (isUpdatingRecurringPatternRef.current) return;
                        if (field.value?.getTime() === date?.getTime()) return; // No change needed
                        
                        isUpdatingRecurringPatternRef.current = true;
                        
                        // Get current pattern and update only endDate
                        const currentPattern = getValues('recurringPattern') || {};
                        const newPattern: any = {
                          ...currentPattern,
                          endDate: date,
                        };
                        // Ensure frequency is included if it exists
                        if (currentPattern && 'frequency' in currentPattern) {
                          newPattern.frequency = currentPattern.frequency;
                        }
                        
                        // Use setValue for the entire recurringPattern object
                        setValue('recurringPattern', newPattern, { 
                          shouldValidate: true,
                          shouldDirty: true 
                        });
                        
                        // Reset flag
                        setTimeout(() => {
                          isUpdatingRecurringPatternRef.current = false;
                        }, 50);
                      };
                      
                      return (
                        <DatePicker
                          value={field.value}
                          onChange={handleEndDateChange}
                          label="End Date (Optional)"
                          showTime={false}
                          showPresets={false}
                          disabled={isLoading}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Receipt ID */}
          <div className="space-y-2">
            <Label htmlFor="receiptId">Receipt ID (Optional)</Label>
            <Input
              id="receiptId"
              {...register('receiptId', {
                setValueAs: (value) => value === '' ? undefined : value,
                validate: (value) => {
                  if (!value || value === '') return true; // Allow empty
                  return /^[0-9a-fA-F]{24}$/.test(value) || 'Receipt ID must be a valid MongoDB ObjectId';
                },
              })}
              disabled={isLoading}
              placeholder="Receipt ID"
            />
            {errors.receiptId && (
              <p className="text-sm text-destructive">{errors.receiptId.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update Transaction' : 'Create Transaction'}
                </>
              )}
            </Button>
          </div>
    </form>
  );

  if (showCard) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Transaction' : 'Create Transaction'}</CardTitle>
        </CardHeader>
        <CardContent>
          {formContent}
        </CardContent>
      </Card>
    );
  }

  return <div className={className}>{formContent}</div>;
}

