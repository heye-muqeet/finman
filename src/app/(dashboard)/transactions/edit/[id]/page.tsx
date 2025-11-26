/**
 * Edit Transaction Page
 * Standalone page for editing an existing transaction
 */

'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  getTransactionById,
  clearFormDraft,
  clearError,
} from '@/lib/store/slices/transactionsSlice';
import TransactionForm from '@/components/transactions/TransactionForm';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const transactionId = params.id as string;
  
  const {
    selectedTransaction,
    isLoading,
    error,
  } = useAppSelector((state) => state.transactions);

  const { toasts, success, error: showError, removeToast } = useToast();

  // Fetch transaction on mount
  useEffect(() => {
    if (transactionId) {
      dispatch(getTransactionById(transactionId));
    }
  }, [dispatch, transactionId]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSuccess = () => {
    // Clear form draft on success
    dispatch(clearFormDraft());
    success('Transaction updated', 'Your transaction has been successfully updated.');
    // Redirect to transactions list after a short delay to show toast
    setTimeout(() => {
      router.push('/transactions');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/transactions');
  };

  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  // Show loading state while fetching transaction
  if (isLoading && !selectedTransaction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Show error if transaction not found
  if (error && !selectedTransaction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error || 'Transaction not found'}</span>
            <button
              onClick={handleErrorDismiss}
              className="ml-4 text-sm underline"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
        <Button onClick={handleCancel} variant="outline">
          Back to Transactions
        </Button>
      </div>
    );
  }

  // Show form if transaction is loaded
  if (!selectedTransaction) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
            <p className="text-muted-foreground mt-2">
              Update transaction details
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleErrorDismiss}
                className="ml-4 text-sm underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Transaction Form */}
        <div className="max-w-4xl">
          <TransactionForm
            initialData={selectedTransaction}
            mode="edit"
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

