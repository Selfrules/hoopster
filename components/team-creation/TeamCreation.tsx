import React, { useState, useCallback } from 'react';
import { usePlayerData } from '../../hooks/usePlayerData';
import { BudgetManager } from './BudgetManager';
import { PositionTracker } from './PositionTracker';
import { PlayerFilters } from './PlayerFilters';

interface TeamCreationProps {
  leagueId: number;
  matchdayId: number;
}

const POSITION_LIMITS = {
  Center: 2,
  Forward: 4,
  Guard: 4,
  Coach: 1,
};

const TEAM_PLAYER_LIMIT = 3;

export function TeamCreation({ leagueId, matchdayId }: TeamCreationProps) {
  const { players, isLoading, error } = usePlayerData(leagueId, matchdayId);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [totalBudget, setTotalBudget] = useState(100);
  const [sort, setSort] = useState('-quotation');
  const [filters, setFilters] = useState({
    position: '',
    onlyAvailable: false,
    onlyOnFire: false,
  });

  const usedBudget = players
    .filter(player => selectedPlayers.includes(player.id))
    .reduce((sum, player) => sum + player.quotation, 0);

  const positionCounts = selectedPlayers.reduce((counts, playerId) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      const position = player.position.name as keyof typeof POSITION_LIMITS;
      counts[position] = (counts[position] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  const teamCounts = selectedPlayers.reduce((counts, playerId) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      counts[player.team.name] = (counts[player.team.name] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  const handlePlayerToggle = useCallback((playerId: number, playerCost: number) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.includes(playerId);
      const player = players.find(p => p.id === playerId);
      
      if (!player) return prev;

      const newSelection = isSelected
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId];

      const newPositionCounts = newSelection.reduce((counts, id) => {
        const p = players.find(p => p.id === id);
        if (p) {
          const pos = p.position.name as keyof typeof POSITION_LIMITS;
          counts[pos] = (counts[pos] || 0) + 1;
        }
        return counts;
      }, {} as Record<string, number>);

      if (!isSelected) {
        if ((newPositionCounts[player.position.name] || 0) > POSITION_LIMITS[player.position.name as keyof typeof POSITION_LIMITS]) {
          alert(`You can only have ${POSITION_LIMITS[player.position.name as keyof typeof POSITION_LIMITS]} ${player.position.name}(s)`);
          return prev;
        }

        const teamCount = newSelection.filter(id => {
          const p = players.find(p => p.id === id);
          return p?.team.name === player.team.name;
        }).length;

        if (teamCount > TEAM_PLAYER_LIMIT) {
          alert(`You can only have ${TEAM_PLAYER_LIMIT} players from the same team`);
          return prev;
        }

        const newTotalCost = players
          .filter(p => newSelection.includes(p.id))
          .reduce((sum, p) => sum + p.quotation, 0);

        if (newTotalCost > totalBudget) {
          alert('This selection would exceed your budget limit!');
          return prev;
        }
      }

      return newSelection;
    });
  }, [players, totalBudget]);

  const filteredPlayers = players
    .filter(player => {
      if (filters.position && player.position.name !== filters.position) return false;
      if (filters.onlyAvailable && player.is_injured) return false;
      if (filters.onlyOnFire && !player.is_on_fire) return false;
      return true;
    })
    .sort((a, b) => {
      const [field, order] = sort.startsWith('-') 
        ? [sort.slice(1), -1] 
        : [sort, 1];
      return (a[field as keyof typeof a] - b[field as keyof typeof a]) * order;
    });

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
      <BudgetManager
        totalBudget={totalBudget}
        usedBudget={usedBudget}
        onBudgetChange={setTotalBudget}
      />

      <PositionTracker
        currentCount={positionCounts}
        limits={POSITION_LIMITS}
      />

      <PlayerFilters
        onSortChange={setSort}
        onFilterChange={setFilters}
        currentSort={sort}
        currentFilters={filters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map(player => {
          const isSelected = selectedPlayers.includes(player.id);
          
          return (
            <div
              key={player.id}
              className={`player-card p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                isSelected ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => handlePlayerToggle(player.id, player.quotation)}
            >
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
                <div className={`p-2 rounded ${isSelected ? 'bg-indigo-50' : 'bg-blue-50'}`}>
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
          );
        })}
      </div>
    </div>
  );
} 