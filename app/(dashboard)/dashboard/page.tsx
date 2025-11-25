/**
 * Dashboard Page (Temporary)
 * This will be fully implemented in Chunk 11
 */

'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to FinMan</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <p>Welcome back, {user.email}!</p>
            ) : (
              <p>Loading...</p>
            )}
            <p className="mt-4 text-muted-foreground">
              This is a temporary dashboard. Full dashboard implementation coming in Chunk 11.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

