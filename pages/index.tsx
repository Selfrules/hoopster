import React from 'react';
import { Layout } from '../components/layout/Layout';
import Link from 'next/link';

function HomePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            NBA Fantasy League
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            Create your dream team and compete against other players in the ultimate NBA fantasy experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/team-generator"
              className="block p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">Team Generator</h2>
              <p className="text-indigo-700">
                Create and manage your fantasy team with our smart team generator.
              </p>
            </Link>

            <Link
              href="/schedule"
              className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h2 className="text-2xl font-bold text-green-900 mb-2">NBA Schedule</h2>
              <p className="text-green-700">
                View today's games, matchups, and team schedules.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage; 