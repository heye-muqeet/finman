/**
 * Sidebar Component
 * Navigation sidebar for dashboard layout
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setSidebarOpen } from '@/lib/store/slices/uiSlice';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Wallet,
  Target,
  TrendingUp,
  FileText,
  PieChart,
  Receipt,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Transactions', href: '/transactions', icon: <Wallet className="h-5 w-5" /> },
  { label: 'Budgets', href: '/budgets', icon: <Target className="h-5 w-5" /> },
  { label: 'Goals', href: '/goals', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'Reports', href: '/reports', icon: <FileText className="h-5 w-5" /> },
  { label: 'Analytics', href: '/analytics', icon: <PieChart className="h-5 w-5" /> },
  { label: 'Receipts', href: '/receipts', icon: <Receipt className="h-5 w-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 lg:z-40 h-screen lg:h-[calc(100vh-4rem)] lg:top-16 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
            <h2 className="text-xl font-bold">FinMan</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 FinMan. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

