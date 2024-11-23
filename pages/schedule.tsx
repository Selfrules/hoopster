import React from 'react';
import { Layout } from '../components/layout/Layout';
import { MatchdaySchedule } from '../components/matchday-schedule/MatchdaySchedule';

function SchedulePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            NBA Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            View today's NBA games, matchups, and team schedules.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <MatchdaySchedule leagueId={19} matchdayId={679} />
        </div>
      </div>
    </Layout>
  );
}

export default SchedulePage; 