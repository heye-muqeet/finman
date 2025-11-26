/**
 * Profile Settings Page
 * User profile management page
 */

'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchUserProfile,
  updateUserProfile,
  clearError,
} from '@/lib/store/slices/authSlice';
import ProfileForm from '@/components/settings/ProfileForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import type { UpdateProfileInput } from '@/lib/validators/user.validator';
import { RefreshCw } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const { success, error: showError } = useToast();

  // Fetch user profile on mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  // Handle form submission
  const handleSubmit = async (data: UpdateProfileInput) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      success('Profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      showError(errorMessage);
    }
  };

  // Handle error dismissal
  const handleDismissError = () => {
    dispatch(clearError());
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchUserProfile());
  };

  if (isLoading && !user) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and preferences
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissError}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <ProfileForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

