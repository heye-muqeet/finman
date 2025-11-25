/**
 * Test API Route - Database Connection
 * Verifies MongoDB connection is working
 * GET /api/v1/test/db
 */

import { NextResponse } from 'next/server';
import { connectDB, isConnected } from '@/lib/database/connection';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET() {
  try {
    // Ensure connection
    if (!isConnected()) {
      await connectDB();
    }

    const connectionState = isConnected();
    const mongoose = await import('mongoose');
    
    return successResponse(
      {
        connected: connectionState,
        readyState: mongoose.default.connection.readyState,
        database: mongoose.default.connection.db?.databaseName,
        host: mongoose.default.connection.host,
        port: mongoose.default.connection.port,
      },
      'Database connection test successful'
    );
  } catch (error) {
    console.error('Database connection test failed:', error);
    return errorResponse(
      {
        code: 'DATABASE_CONNECTION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to connect to database',
      },
      500
    );
  }
}

