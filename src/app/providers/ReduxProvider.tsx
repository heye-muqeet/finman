/**
 * Redux Provider Component
 * Wraps the application with Redux Provider and Redux Persist PersistGate
 */

'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';
import type { ReactNode } from 'react';

/**
 * Redux Provider Props
 */
interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Redux Provider Component
 * Provides Redux store and persistence to the application
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

