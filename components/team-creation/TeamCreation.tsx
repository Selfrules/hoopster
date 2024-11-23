import React, { useState } from 'react';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useTeamManagement } from '../../lib/hooks/useTeamManagement';
import { BudgetManager } from './BudgetManager';
import { PositionTracker } from './PositionTracker';
import { PlayerFilters } from './PlayerFilters';
import type { 
  Player, 
  PositionCount, 
  PlayerFilters as PlayerFiltersType,
  SortOption,
  SortableField,
  PositionName
} from '../../lib/types';
import { SORTABLE_FIELDS } from '../../lib/types';

interface TeamCreationProps {
  leagueId: number;
  matchdayId: number;
}

const POSITION_LIMITS: Record<PositionName, number> = {
  Center: 2,
  Forward: 4,
  Guard: 4,
  Coach: 1,
} as const;

const TEAM_PLAYER_LIMIT = 3;

export function TeamCreation({ leagueId, matchdayId }: TeamCreationProps) {
  const { players, isLoading, error } = usePlayerData(leagueId, matchdayId);
  
  const [totalBudget, setTotalBudget] = useState(100);
  const [sort, setSort] = useState<SortOption>('-quotation');
  const [filters, setFilters] = useState<PlayerFiltersType>({
    position: '',
    onlyAvailable: false,
    onlyOnFire: false,
  });

  const teamManagement = useTeamManagement(players, {
    maxBudget: totalBudget,
    positionLimits: POSITION_LIMITS,
    teamPlayerLimit: TEAM_PLAYER_LIMIT,
  });

  const { selectedPlayers, togglePlayer } = teamManagement;

  const usedBudget = selectedPlayers.reduce((sum, playerId) => {
    const player = players.find((p: Player) => p.id === playerId);
    return player ? sum + player.quotation : sum;
  }, 0);

  const positionCounts: PositionCount = selectedPlayers.reduce((counts, playerId) => {
    const player = players.find((p: Player) => p.id === playerId);
    if (player) {
      const position = player.position.name as keyof PositionCount;
      counts[position] = (counts[position] || 0) + 1;
    }
    return counts;
  }, { Center: 0, Forward: 0, Guard: 0, Coach: 0 });

  const teamCounts = selectedPlayers.reduce((counts, playerId) => {
    const player = players.find((p: Player) => p.id === playerId);
    if (player?.team) {
      const teamName = player.team.name;
      counts[teamName] = (counts[teamName] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  const filteredPlayers = players
    .filter((player: Player) => {
      if (filters.position && player.position.name !== filters.position) return false;
      if (filters.onlyAvailable && player.is_injured) return false;
      if (filters.onlyOnFire && !player.is_on_fire) return false;
      return true;
    })
    .sort((a: Player, b: Player) => {
      const direction = sort.startsWith('-') ? -1 : 1;
      const field = sort.replace('-', '') as SortableField;
      
      if (!SORTABLE_FIELDS.includes(field)) return 0;
      return ((a[field] as number) - (b[field] as number)) * direction;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold mb-2">Error loading players</p>
          <p className="text-sm">{typeof error === 'string' ? error : 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold mb-2">No players available</p>
          <p className="text-sm">Please check back later or try different filters</p>
        </div>
      </div>
    );
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
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        currentSort={sort}
        currentFilters={filters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => {
          const isSelected = selectedPlayers.includes(player.id);
          
          return (
            <div
              key={player.id}
              className={`player-card p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                isSelected ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => togglePlayer(player.id)}
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