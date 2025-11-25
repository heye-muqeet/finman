/**
 * Test Redux Page
 * Temporary page to test Redux store functionality
 * This page will be removed or replaced in future chunks
 */

'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { loginUser, logout, setAuth } from '@/lib/store/slices/authSlice';
import { setTheme, toggleSidebar } from '@/lib/store/slices/uiSlice';
import { useEffect } from 'react';

export default function TestReduxPage() {
  const dispatch = useAppDispatch();
  
  // Get state from Redux store
  const auth = useAppSelector((state) => state.auth);
  const ui = useAppSelector((state) => state.ui);
  const user = useAppSelector((state) => state.user);

  // Test: Initialize auth from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      // If tokens exist but user is not authenticated, initialize from localStorage
      if (token && !auth.isAuthenticated) {
        // Note: In a real app, you'd fetch user data from API with the token
        // For now, this is just a test
        console.log('Tokens found in localStorage:', { token: token.substring(0, 20) + '...', refreshToken });
      }
    }
  }, [auth.isAuthenticated]);

  const handleTestLogin = async () => {
    // Test login action (will fail without valid credentials, but tests Redux)
    dispatch(loginUser({ email: 'test@example.com', password: 'Test123!' }));
  };

  const handleTestLogout = () => {
    dispatch(logout());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleSetTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(theme));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Redux Store Test Page</h1>
        
        {/* Auth State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {auth.isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Is Loading:</strong> {auth.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {auth.error || 'None'}</p>
            <p><strong>Token:</strong> {auth.token ? `${auth.token.substring(0, 20)}...` : 'None'}</p>
            <p><strong>User Email:</strong> {auth.user?.email || 'None'}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleTestLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Login Action
            </button>
            <button
              onClick={handleTestLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* UI State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">UI State</h2>
          <div className="space-y-2">
            <p><strong>Theme:</strong> {ui.theme}</p>
            <p><strong>Sidebar Open:</strong> {ui.sidebarOpen ? 'Yes' : 'No'}</p>
            <p><strong>Is Loading:</strong> {ui.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Notifications:</strong> {ui.notifications.length}</p>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={handleToggleSidebar}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Toggle Sidebar
            </button>
            <button
              onClick={() => handleSetTheme('light')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Light Theme
            </button>
            <button
              onClick={() => handleSetTheme('dark')}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Dark Theme
            </button>
            <button
              onClick={() => handleSetTheme('system')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              System Theme
            </button>
          </div>
        </div>

        {/* User State */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User State</h2>
          <div className="space-y-2">
            <p><strong>Profile:</strong> {user.profile ? 'Loaded' : 'None'}</p>
            <p><strong>Preferences:</strong> {user.preferences ? 'Loaded' : 'None'}</p>
            <p><strong>Is Loading:</strong> {user.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {user.error || 'None'}</p>
          </div>
        </div>

        {/* Redux DevTools Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Redux DevTools:</strong> Open your browser DevTools and look for the Redux tab to inspect the store state.
          </p>
        </div>
      </div>
    </div>
  );
}

