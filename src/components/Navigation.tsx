'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎣</span>
            <span className="text-xl font-bold text-gray-900">HookedIn</span>
          </Link>

          <div className="flex space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'bg-linkedin text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/create"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'bg-linkedin text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Create Webhook
            </Link>
            <Link
              href="/manage"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/manage') || isActive('/webhook')
                  ? 'bg-linkedin text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Manage Webhooks
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
