import React from 'react';
import { usePlayerData } from '../../hooks/usePlayerData';

interface TeamCreationProps {
  leagueId: number;
  matchdayId: number;
}

export function TeamCreation({ leagueId, matchdayId }: TeamCreationProps) {
  const { players, isLoading, error } = usePlayerData(leagueId, matchdayId);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!players || players.length === 0) {
    return <div className="text-center">No players available.</div>;
  }

  return (
    <div className="team-creation p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Fantasy Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <div key={player.id} className="player-card p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">
                {player.first_name} {player.last_name}
              </h2>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                #{player.jersey}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              <p>
                {player.position.name}
                {player.opponent && (
                  <> • vs {player.opponent.abbreviation}</>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-sm font-medium">Credits</p>
                <p className="text-lg">{player.quotation}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-sm font-medium">Avg Points</p>
                <p className="text-lg">{player.avg_pts}</p>
              </div>
            </div>

            <div className="text-sm">
              <div className="flex gap-2 mb-1">
                {player.is_injured && (
                  <span className="text-red-500 bg-red-50 px-2 py-1 rounded">Injured</span>
                )}
                {player.is_on_fire && (
                  <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded">On Fire</span>
                )}
                {player.started_from_bench && (
                  <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded">Bench</span>
                )}
              </div>
              
              <div className="mt-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Playing Probability:</span>
                  <span>{(player.probability_of_playing * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Popularity:</span>
                  <span>{(player.popularity * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 