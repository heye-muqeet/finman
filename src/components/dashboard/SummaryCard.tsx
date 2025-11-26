/**
 * Summary Card Component
 * Reusable card component for displaying financial summary metrics
 */

'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'income' | 'expense' | 'balance';
  className?: string;
}

/**
 * Format number as currency
 */
function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with sign
 */
function formatNumber(value: number, currency?: string): string {
  if (currency) {
    return formatCurrency(value, currency);
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: SummaryCardProps) {
  // Determine value display
  const displayValue = typeof value === 'number' 
    ? formatNumber(value) 
    : value;

  // Variant-based styling
  const variantStyles = {
    default: 'text-foreground',
    income: 'text-green-600 dark:text-green-400',
    expense: 'text-red-600 dark:text-red-400',
    balance: 'text-blue-600 dark:text-blue-400',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    income: 'text-green-600 dark:text-green-400',
    expense: 'text-red-600 dark:text-red-400',
    balance: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <Icon className={cn('h-4 w-4', iconStyles[variant])} />
        )}
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', variantStyles[variant])}>
          {displayValue}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive !== false
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive !== false ? '+' : ''}
              {formatNumber(trend.value)}
            </span>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

