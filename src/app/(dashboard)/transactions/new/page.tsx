/**
 * Create Transaction Page
 * Standalone page for creating a new transaction
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { clearFormDraft } from '@/lib/store/slices/transactionsSlice';
import TransactionForm from '@/components/transactions/TransactionForm';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewTransactionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toasts, success, error: showError, removeToast } = useToast();

  const handleSuccess = () => {
    // Clear form draft on success
    dispatch(clearFormDraft());
    success('Transaction created', 'Your transaction has been successfully created.');
    // Redirect to transactions list after a short delay to show toast
    setTimeout(() => {
      router.push('/transactions');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/transactions');
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Create Transaction</h1>
            <p className="text-muted-foreground mt-2">
              Add a new income or expense transaction
            </p>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="max-w-4xl">
          <TransactionForm
            mode="create"
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

