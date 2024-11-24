import React from 'react';
import { Player } from '../../lib/types';

interface TeamGenerationStatsProps {
  generatedTeam: Player[];
  totalBudget: number;
}

export function TeamGenerationStats({ generatedTeam, totalBudget }: TeamGenerationStatsProps) {
  const totalCost = generatedTeam.reduce((sum, player) => sum + player.quotation, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Team Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-xl font-semibold text-indigo-600">
            {totalCost.toFixed(2)} / {totalBudget.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Avg Score</p>
          <p className="text-xl font-semibold text-green-600">
            {(
              generatedTeam.reduce((sum, player) => sum + player.avg_pts, 0) /
              generatedTeam.length
            ).toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">On Fire Players</p>
          <p className="text-xl font-semibold text-orange-600">
            {generatedTeam.filter(player => player.is_on_fire).length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Team Balance</p>
          <p className="text-xl font-semibold text-blue-600">
            {((generatedTeam.length / 11) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
} 