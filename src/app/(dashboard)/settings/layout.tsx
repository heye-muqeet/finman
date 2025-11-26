/**
 * Settings Layout
 * Layout for settings pages with sub-navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { User, Lock } from 'lucide-react';

const settingsNavItems = [
  {
    label: 'Profile',
    href: '/settings/profile',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    label: 'Password',
    href: '/settings/password',
    icon: Lock,
    description: 'Change your password',
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Settings Navigation */}
        <nav className="space-y-1">
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Content */}
        <div className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}

