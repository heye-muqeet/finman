/**
 * Header Component
 * Top header bar with user menu and navigation controls
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout } from '@/lib/store/slices/authSlice';
import { toggleSidebar } from '@/lib/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Menu, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold lg:text-2xl">FinMan</h1>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{getUserDisplayName()}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  userMenuOpen && 'rotate-180'
                )}
              />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-lg">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

