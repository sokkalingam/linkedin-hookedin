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
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🎣</span>
            <span className="text-xl font-semibold text-gray-900">HookedIn</span>
          </Link>

          <div className="flex space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') && pathname === '/'
                  ? 'bg-linkedin text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/create"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/create')
                  ? 'bg-linkedin text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Create
            </Link>
            <Link
              href="/manage"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/manage') || isActive('/webhook')
                  ? 'bg-linkedin text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
