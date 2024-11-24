import React, { useState } from 'react';
import { useTeamGenerator } from '../../lib/hooks/useTeamGenerator';
import { Player, PositionName } from '../../lib/types';
import { TeamGenerationStats } from './TeamGenerationStats';
import { PlayerComparison } from './PlayerComparison';

interface TeamGeneratorProps {
  players: Player[];
  budget: number;
  positionLimits: Record<PositionName, number>;
  teamPlayerLimit: number;
  onTeamGenerated: (players: Player[]) => void;
}

interface GenerationPreferences {
  prioritizeOnFire: boolean;
  balanceTeams: boolean;
  maximizeProbability: boolean;
}

export function TeamGenerator({
  players,
  budget,
  positionLimits,
  teamPlayerLimit,
  onTeamGenerated,
}: TeamGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTeam, setGeneratedTeam] = useState<Player[] | null>(null);
  const [preferences, setPreferences] = useState<GenerationPreferences>({
    prioritizeOnFire: true,
    balanceTeams: true,
    maximizeProbability: true,
  });

  const handleReset = () => {
    setGeneratedTeam(null);
    setPreferences({
      prioritizeOnFire: true,
      balanceTeams: true,
      maximizeProbability: true,
    });
    onTeamGenerated([]); // Clear selected players
    window.location.reload(); // Hard reset to clear all choices and outputs
  };

  const { generateOptimalTeam } = useTeamGenerator(players, {
    budget,
    positionLimits,
    teamPlayerLimit,
    preferences,
  });

  const handleGenerateTeam = async () => {
    setIsGenerating(true);
    try {
      const result = generateOptimalTeam();
      if (result && result.isComplete) {
        const generatedPlayers = result.players;
        setGeneratedTeam(generatedPlayers);
        onTeamGenerated(generatedPlayers);
      } else {
        alert('Could not generate a complete team with the current constraints');
      }
    } catch (error) {
      console.error('Team generation failed:', error);
      alert('Failed to generate team. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Generation Preferences</h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.prioritizeOnFire}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                prioritizeOnFire: e.target.checked
              }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Prioritize "On Fire" players</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.balanceTeams}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                balanceTeams: e.target.checked
              }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Balance team selection</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.maximizeProbability}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                maximizeProbability: e.target.checked
              }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Maximize playing probability</span>
          </label>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleGenerateTeam}
            disabled={isGenerating}
            className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Team...
              </span>
            ) : (
              'Generate Optimal Team'
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Display generated team stats and comparison */}
      {generatedTeam && generatedTeam.length > 0 && (
        <>
          <TeamGenerationStats
            generatedTeam={generatedTeam}
            totalBudget={budget}
          />
          <PlayerComparison
            players={generatedTeam}
            onPlayerSwap={(oldPlayerId, newPlayerId) => {
              const newTeam = generatedTeam.map(player =>
                player.id === oldPlayerId
                  ? players.find(p => p.id === newPlayerId)!
                  : player
              );
              setGeneratedTeam(newTeam);
              onTeamGenerated(newTeam);
            }}
          />
        </>
      )}
    </div>
  );
} 