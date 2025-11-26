/**
 * Profile Form Component
 * Form for editing user profile information
 */

'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validators/user.validator';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/types/user.types';
import { Loader2 } from 'lucide-react';

interface ProfileFormProps {
  user: User | null;
  onSubmit: (data: UpdateProfileInput) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

// Common currencies
const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];

// Common timezones
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

export default function ProfileForm({
  user,
  onSubmit,
  isLoading = false,
  error,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      currency: user?.currency || 'USD',
      timezone: user?.timezone || 'UTC',
      preferences: {
        theme: (user?.preferences?.theme as 'light' | 'dark' | 'system') || 'light',
        notifications: user?.preferences?.notifications ?? true,
        language: user?.preferences?.language || 'en',
        currency: user?.preferences?.currency || 'USD',
        timezone: user?.preferences?.timezone || 'UTC',
        dateFormat: user?.preferences?.dateFormat || 'YYYY-MM-DD',
        timeFormat: user?.preferences?.timeFormat || '12h',
      },
    },
  });

  // Update form when user data changes (reset form to clear dirty state)
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        currency: user.currency || 'USD',
        timezone: user.timezone || 'UTC',
        preferences: {
          theme: (user.preferences?.theme as 'light' | 'dark' | 'system') || 'light',
          notifications: user.preferences?.notifications ?? true,
          language: user.preferences?.language || 'en',
          currency: user.preferences?.currency || 'USD',
          timezone: user.preferences?.timezone || 'UTC',
          dateFormat: user.preferences?.dateFormat || 'YYYY-MM-DD',
          timeFormat: user.preferences?.timeFormat || '12h',
        },
      });
    }
  }, [user, reset]);

  const onSubmitForm = async (data: UpdateProfileInput) => {
    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

          {/* Regional Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Regional Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
                {errors.currency && (
                  <p className="text-sm text-destructive">{errors.currency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.timezone && (
                  <p className="text-sm text-destructive">{errors.timezone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferences.theme">Theme</Label>
                <Controller
                  name="preferences.theme"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="preferences.theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.preferences?.theme && (
                  <p className="text-sm text-destructive">{errors.preferences.theme.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences.language">Language</Label>
                <Controller
                  name="preferences.language"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="preferences.language"
                      {...field}
                      placeholder="en"
                    />
                  )}
                />
                {errors.preferences?.language && (
                  <p className="text-sm text-destructive">{errors.preferences.language.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences.currency">Preferred Currency</Label>
                <Controller
                  name="preferences.currency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="preferences.currency">
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
                  )}
                />
                {errors.preferences?.currency && (
                  <p className="text-sm text-destructive">{errors.preferences.currency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences.timezone">Preferred Timezone</Label>
                <Controller
                  name="preferences.timezone"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="preferences.timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.preferences?.timezone && (
                  <p className="text-sm text-destructive">{errors.preferences.timezone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences.dateFormat">Date Format</Label>
                <Controller
                  name="preferences.dateFormat"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="preferences.dateFormat"
                      {...field}
                      placeholder="YYYY-MM-DD"
                    />
                  )}
                />
                {errors.preferences?.dateFormat && (
                  <p className="text-sm text-destructive">{errors.preferences.dateFormat.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences.timeFormat">Time Format</Label>
                <Controller
                  name="preferences.timeFormat"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="preferences.timeFormat">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.preferences?.timeFormat && (
                  <p className="text-sm text-destructive">{errors.preferences.timeFormat.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="preferences.notifications"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="preferences.notifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="preferences.notifications" className="cursor-pointer">
                Enable notifications
              </Label>
            </div>
            {errors.preferences?.notifications && (
              <p className="text-sm text-destructive">{errors.preferences.notifications.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

