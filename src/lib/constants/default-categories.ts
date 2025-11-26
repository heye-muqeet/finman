/**
 * Default Categories Constants
 * Shared default categories used for seeding new users
 */

export const DEFAULT_CATEGORIES = [
  // Income Categories
  { name: 'Salary', type: 'income' as const, icon: '💼', color: '#10B981' },
  { name: 'Freelance', type: 'income' as const, icon: '💻', color: '#3B82F6' },
  { name: 'Investment', type: 'income' as const, icon: '📈', color: '#8B5CF6' },
  { name: 'Business', type: 'income' as const, icon: '🏢', color: '#F59E0B' },
  { name: 'Gift', type: 'income' as const, icon: '🎁', color: '#EC4899' },
  { name: 'Other Income', type: 'income' as const, icon: '💰', color: '#6B7280' },
  
  // Expense Categories
  { name: 'Food & Dining', type: 'expense' as const, icon: '🍔', color: '#EF4444' },
  { name: 'Transportation', type: 'expense' as const, icon: '🚗', color: '#3B82F6' },
  { name: 'Housing', type: 'expense' as const, icon: '🏠', color: '#8B5CF6' },
  { name: 'Utilities', type: 'expense' as const, icon: '💡', color: '#F59E0B' },
  { name: 'Shopping', type: 'expense' as const, icon: '🛍️', color: '#EC4899' },
  { name: 'Entertainment', type: 'expense' as const, icon: '🎬', color: '#10B981' },
  { name: 'Healthcare', type: 'expense' as const, icon: '🏥', color: '#EF4444' },
  { name: 'Education', type: 'expense' as const, icon: '📚', color: '#3B82F6' },
  { name: 'Travel', type: 'expense' as const, icon: '✈️', color: '#8B5CF6' },
  { name: 'Bills & Fees', type: 'expense' as const, icon: '📄', color: '#6B7280' },
  { name: 'Personal Care', type: 'expense' as const, icon: '💅', color: '#EC4899' },
  { name: 'Other Expense', type: 'expense' as const, icon: '📦', color: '#9CA3AF' },
];

