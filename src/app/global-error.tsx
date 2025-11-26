/**
 * Next.js Global Error Handler
 * Handles errors in the root layout
 */

'use client';

import { useEffect } from 'react';
import { clientLogger } from '@/lib/utils/client-logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { isDevelopment } from '@/lib/utils/env';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error using client-safe logger
    clientLogger.error('Global error handler caught an error', error, {
      digest: error.digest,
      globalError: true,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-2xl">Application Error</CardTitle>
              </div>
              <CardDescription>
                A critical error occurred in the application. Please refresh the page or contact support.
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
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}

