/**
 * Dashboard Layout
 * Layout wrapper for all dashboard pages with Header and Sidebar
 */

'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] mt-16">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

