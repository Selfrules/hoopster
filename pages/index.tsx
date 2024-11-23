import React from 'react';
import { Layout } from '../components/layout/Layout';
import { TeamCreation } from '../components/team-creation/TeamCreation';
import { MatchdaySchedule } from '../components/matchday-schedule/MatchdaySchedule';

function HomePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            NBA Fantasy League
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Create your dream team and compete against other players in the ultimate NBA fantasy experience.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
          <MatchdaySchedule leagueId={19} matchdayId={679} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Players</h2>
          <TeamCreation leagueId={19} matchdayId={679} />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage; 