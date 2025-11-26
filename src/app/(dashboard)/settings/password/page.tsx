/**
 * Change Password Settings Page
 * User password change page
 */

'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { changePassword as changePasswordThunk, clearError } from '@/lib/store/slices/authSlice';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import type { ChangePasswordInput } from '@/lib/validators/auth.validator';

export default function ChangePasswordPage() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { success, error: showError } = useToast();

  // Handle form submission
  const handleSubmit = async (data: ChangePasswordInput) => {
    try {
      await dispatch(changePasswordThunk(data)).unwrap();
      success('Password changed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      showError(errorMessage);
    }
  };

  // Handle error dismissal
  const handleDismissError = () => {
    dispatch(clearError());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Change Password</h2>
        <p className="text-muted-foreground mt-2">
          Update your password to keep your account secure
        </p>
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

      <ChangePasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

