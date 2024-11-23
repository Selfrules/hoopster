import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              legacyBehavior={false}
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
                legacyBehavior={false}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <Link 
              href="/team-generator"
              legacyBehavior={false}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Team
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 