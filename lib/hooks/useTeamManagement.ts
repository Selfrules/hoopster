import { useCallback } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { Player } from '../types';

interface TeamManagementOptions {
  maxBudget: number;
  positionLimits: Record<string, number>;
  teamPlayerLimit: number;
}

export function useTeamManagement(players: Player[], options: TeamManagementOptions) {
  const { selectedPlayers, addPlayer, removePlayer } = useTeamStore();

  const getPlayerCounts = useCallback(() => {
    return selectedPlayers.reduce<Record<string, number>>((counts, playerId) => {
      const player = players.find(p => p.id === playerId);
      if (player) {
        const position = player.position.name;
        counts[position] = (counts[position] || 0) + 1;
      }
      return counts;
    }, {});
  }, [players, selectedPlayers]);

  const getTeamCounts = useCallback(() => {
    return selectedPlayers.reduce<Record<string, number>>((counts, playerId) => {
      const player = players.find(p => p.id === playerId);
      if (player?.team) {
        const teamName = player.team.name;
        counts[teamName] = (counts[teamName] || 0) + 1;
      }
      return counts;
    }, {});
  }, [players, selectedPlayers]);

  const validateSelection = useCallback((playerId: number): string | null => {
    const player = players.find(p => p.id === playerId);
    if (!player) return 'Player not found';

    const positionCounts = getPlayerCounts();
    const teamCounts = getTeamCounts();
    const currentPosition = player.position.name;

    if ((positionCounts[currentPosition] || 0) >= options.positionLimits[currentPosition]) {
      return `Maximum ${options.positionLimits[currentPosition]} ${currentPosition}(s) allowed`;
    }

    if ((teamCounts[player.team.name] || 0) >= options.teamPlayerLimit) {
      return `Maximum ${options.teamPlayerLimit} players allowed from the same team`;
    }

    const totalCost = selectedPlayers.reduce((sum, id) => {
      const p = players.find(p => p.id === id);
      return sum + (p?.quotation || 0);
    }, player.quotation);

    if (totalCost > options.maxBudget) {
      return 'Selection would exceed budget limit';
    }

    return null;
  }, [players, selectedPlayers, options, getPlayerCounts, getTeamCounts]);

  const togglePlayer = useCallback((playerId: number): boolean => {
    const isSelected = selectedPlayers.includes(playerId);
    
    if (isSelected) {
      removePlayer(playerId);
      return true;
    }

    const error = validateSelection(playerId);
    if (error) {
      alert(error);
      return false;
    }

    addPlayer(playerId);
    return true;
  }, [selectedPlayers, addPlayer, removePlayer, validateSelection]);

  return {
    selectedPlayers,
    togglePlayer,
    getPlayerCounts,
    getTeamCounts,
    validateSelection,
  };
} 