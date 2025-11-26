/**
 * Transactions Page
 * Main transactions page with list, create, edit, and delete functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  deleteTransaction,
  clearError,
  getTransactionById,
  clearFormDraft,
} from '@/lib/store/slices/transactionsSlice';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { Transaction } from '@/types/transaction.types';
import { useToast } from '@/hooks/useToast';

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { 
    isDeleting, 
    error,
    selectedTransaction,
    isLoading: isLoadingTransaction,
  } = useAppSelector((state) => state.transactions);
  const { success, error: showError } = useToast();

  const [deleteTransactionState, setDeleteTransactionState] = useState<Transaction | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransactionId(transaction._id);
    setIsEditModalOpen(true);
    dispatch(getTransactionById(transaction._id));
  };

  // Fetch transaction when edit modal opens
  useEffect(() => {
    if (isEditModalOpen && editingTransactionId) {
      dispatch(getTransactionById(editingTransactionId));
    }
  }, [isEditModalOpen, editingTransactionId, dispatch]);

  // Clear selected transaction when modal closes
  useEffect(() => {
    if (!isEditModalOpen && !isCreateModalOpen) {
      dispatch(clearFormDraft());
    }
  }, [isEditModalOpen, isCreateModalOpen, dispatch]);

  const handleDeleteClick = (transaction: Transaction) => {
    setDeleteTransactionState(transaction);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTransactionState) return;

    try {
      await dispatch(deleteTransaction(deleteTransactionState._id)).unwrap();
      setDeleteTransactionState(null);
      success('Transaction deleted', 'The transaction has been successfully deleted.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      showError('Delete failed', errorMessage);
    }
  };

  const handleCreateSuccess = () => {
    dispatch(clearFormDraft());
    setIsCreateModalOpen(false);
    success('Transaction created', 'Your transaction has been successfully created.');
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    dispatch(clearFormDraft());
    setIsEditModalOpen(false);
    setEditingTransactionId(null);
    success('Transaction updated', 'Your transaction has been successfully updated.');
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingTransactionId(null);
  };

  // Clear error when component unmounts or error changes
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground mt-2">
              Manage your income and expense transactions
            </p>
          </div>
          <Button onClick={handleCreateClick} size="default">
            <Plus className="mr-2 h-4 w-4" />
            Create Transaction
          </Button>
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

        {/* Transaction List */}
        <TransactionList
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

        {/* Create Transaction Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              mode="create"
              onSuccess={handleCreateSuccess}
              onCancel={handleCreateCancel}
              showCard={false}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            handleEditCancel();
          }
        }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {isLoadingTransaction && !selectedTransaction ? (
              <div className="space-y-4">
                <Skeleton className="h-96 w-full" />
              </div>
            ) : selectedTransaction ? (
              <TransactionForm
                initialData={selectedTransaction}
                mode="edit"
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
                showCard={false}
              />
            ) : (
              <Alert variant="destructive">
                <AlertDescription>
                  Transaction not found. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteTransactionState}
          onOpenChange={(open) => !open && setDeleteTransactionState(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the transaction{' '}
                {deleteTransactionState && (
                  <>
                    <strong>
                      {deleteTransactionState.description || 
                       `of ${deleteTransactionState.amount} ${deleteTransactionState.currency}`}
                    </strong>
                    . This action cannot be undone.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Toast Container */}
    </>
  );
}

