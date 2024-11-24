import { useMemo } from 'react';
import { Player, PositionName } from '../types';

interface TeamGeneratorOptions {
  budget: number;
  positionLimits: Record<PositionName, number>;
  teamPlayerLimit: number;
  preferences?: GenerationPreferences;
}

interface GenerationPreferences {
  prioritizeOnFire: boolean;
  balanceTeams: boolean;
  maximizeProbability: boolean;
}

interface PlayerScore {
  player: Player;
  score: number;
  efficiencyScore: number;
  performanceScore: number;
  reliabilityScore: number;
}

interface GenerationResult {
  players: Player[];
  isComplete: boolean;
  remainingBudget: number;
  stats?: {
    totalCost: number;
    averageScore: number;
    onFireCount: number;
    averageProbability: number;
    teamBalance: number;
  };
}

export function useTeamGenerator(players: Player[], options: TeamGeneratorOptions) {
  const calculatePlayerScore = (player: Player, preferences?: GenerationPreferences): PlayerScore => {
    // Base efficiency score (points per credit)
    const efficiencyScore = (player.avg_pts / player.quotation) * 10;
    
    // Performance score
    let performanceScore = player.avg_pts * 2;
    if (preferences?.prioritizeOnFire && player.is_on_fire) {
      performanceScore *= 1.5;
    }
    
    // Calculate final score
    const baseScore = efficiencyScore + performanceScore;
    
    return {
      player,
      score: baseScore,
      efficiencyScore,
      performanceScore,
      reliabilityScore: player.probability_of_playing * 10,
    };
  };

  const generateOptimalTeam = (): GenerationResult | null => {
    // Pre-filter players
    const availablePlayers = players.filter(player => 
      !player.is_injured && 
      player.probability_of_playing >= 0.7 && 
      player.opponent // Has an opponent (playing today)
    );

    // Group players by position
    const playersByPosition: Record<PositionName, Player[]> = {
      Center: [],
      Forward: [],
      Guard: [],
      'Head Coach': [],
    };

    // Group players by position
    availablePlayers.forEach(player => {
      const position = player.position.name as PositionName;
      if (position in playersByPosition) {
        playersByPosition[position].push(player);
      }
    });

    // Sort players by Points per Credit ratio and prioritize "On Fire" players
    Object.values(playersByPosition).forEach(positionPlayers => {
      positionPlayers.sort((a, b) => {
        const valueA = a.avg_pts / a.quotation;
        const valueB = b.avg_pts / b.quotation;
        if (a.is_on_fire && !b.is_on_fire) return -1;
        if (!a.is_on_fire && b.is_on_fire) return 1;
        return valueB - valueA;
      });
    });

    let selectedPlayers: Player[] = [];
    let remainingBudget = options.budget;
    const teamCounts: Record<string, number> = {};

    // Helper function to select players for a position
    const selectPlayersForPosition = (position: PositionName, count: number): boolean => {
      const positionPlayers = [...playersByPosition[position]]; // Create a copy to modify
      let selected = 0;

      while (selected < count && positionPlayers.length > 0) {
        // Find the best player that fits in the budget
        const player = positionPlayers.find(p => {
          const teamCount = teamCounts[p.team.name] || 0;
          return p.quotation <= remainingBudget && teamCount < options.teamPlayerLimit;
        });

        if (!player) break; // No valid player found

        selectedPlayers.push(player);
        remainingBudget -= player.quotation;
        teamCounts[player.team.name] = (teamCounts[player.team.name] || 0) + 1;
        selected++;
        
        // Remove selected player from available players
        const index = positionPlayers.indexOf(player);
        positionPlayers.splice(index, 1);
      }

      return selected === count;
    };

    // Select players in order of importance
    const positionOrder: [PositionName, number][] = [
      ['Center', 2],      // First centers (need 2)
      ['Forward', 4],     // Then forwards (need 4)
      ['Guard', 4],       // Then guards (need 4)
      ['Head Coach', 1],  // Finally coach (need 1)
    ];

    // Try to fill all positions
    const allPositionsFilled = positionOrder.every(([position, count]) => 
      selectPlayersForPosition(position, count)
    );

    if (!allPositionsFilled || remainingBudget < 0) {
      return null;
    }

    return {
      players: selectedPlayers,
      isComplete: true,
      remainingBudget,
      stats: {
        totalCost: options.budget - remainingBudget,
        averageScore: selectedPlayers.reduce((sum, p) => sum + p.avg_pts, 0) / selectedPlayers.length,
        onFireCount: selectedPlayers.filter(p => p.is_on_fire).length,
        averageProbability: selectedPlayers.reduce((sum, p) => sum + p.probability_of_playing, 0) / selectedPlayers.length,
        teamBalance: Object.keys(teamCounts).length,
      }
    };
  };

  return {
    generateOptimalTeam,
  };
} 