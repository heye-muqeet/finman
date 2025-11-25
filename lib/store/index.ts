/**
 * Redux Store Configuration
 * Configures Redux store with Redux Toolkit and Redux Persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

/**
 * Redux Persist configuration
 */
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Only persist auth slice (user and token)
  whitelist: ['auth'],
  // Don't persist UI state (sidebar, notifications, etc.)
  blacklist: ['ui'],
};

/**
 * Root reducer combining all slices
 */
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
});

/**
 * Persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Redux store configuration
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Persistor for Redux Persist
 */
export const persistor = persistStore(store);

/**
 * Root state type
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * App dispatch type
 */
export type AppDispatch = typeof store.dispatch;

