import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/"
                className="text-xl font-bold text-indigo-600"
              >
                Hoopster
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {[
                { href: '/team-generator', label: 'Team Generator' },
                { href: '/schedule', label: 'Schedule' },
                { href: '/leaderboard', label: 'Leaderboard' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(href) ? 'text-indigo-600' : ''
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center">
              <Link 
                href="/team-generator"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Create Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 