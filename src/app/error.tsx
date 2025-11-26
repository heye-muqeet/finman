/**
 * Next.js Error Page
 * Handles errors in the app directory
 */

'use client';

import { useEffect } from 'react';
import { clientLogger } from '@/lib/utils/client-logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { isDevelopment } from '@/lib/utils/env';
import { useAppSelector } from '@/lib/store/hooks';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Log error using client-safe logger
    clientLogger.error('Next.js error page caught an error', error, {
      digest: error.digest,
      errorPage: true,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl">Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message || 'An unknown error occurred'}
            </AlertDescription>
            {error.digest && (
              <AlertDescription className="mt-1 text-xs">
                Error ID: {error.digest}
              </AlertDescription>
            )}
          </Alert>

          {isDevelopment && error.stack && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-mono text-muted-foreground whitespace-pre-wrap break-all">
                {error.stack}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

