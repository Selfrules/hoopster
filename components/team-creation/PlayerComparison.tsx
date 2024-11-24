import React from 'react';
import { Player } from '../../lib/types';

interface PlayerComparisonProps {
  players: Player[];
  onPlayerSwap: (oldPlayerId: number, newPlayerId: number) => void;
}

export function PlayerComparison({ players, onPlayerSwap }: PlayerComparisonProps) {
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [showAlternatives, setShowAlternatives] = React.useState(false);

  const getAlternativePlayers = (player: Player) => {
    return players.filter(p => 
      p.position.name === player.position.name && 
      p.id !== player.id &&
      !p.is_injured
    ).sort((a, b) => b.avg_pts - a.avg_pts).slice(0, 5);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Alternatives</h3>
      
      {selectedPlayer && showAlternatives ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">
              Alternatives for {selectedPlayer.first_name} {selectedPlayer.last_name}
            </h4>
            <button
              onClick={() => setShowAlternatives(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to List
            </button>
          </div>
          
          <div className="grid gap-3">
            {getAlternativePlayers(selectedPlayer).map(player => (
              <div
                key={player.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium">{player.first_name} {player.last_name}</p>
                  <p className="text-sm text-gray-600">
                    {player.position.name} • {player.team.name}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{player.quotation} cr</p>
                    <p className="text-sm text-gray-600">{player.avg_pts} pts</p>
                  </div>
                  <button
                    onClick={() => {
                      onPlayerSwap(selectedPlayer.id, player.id);
                      setShowAlternatives(false);
                      setSelectedPlayer(null);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {players.map(player => (
            <div
              key={player.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div>
                <p className="font-medium">{player.first_name} {player.last_name}</p>
                <p className="text-sm text-gray-600">
                  {player.position.name} • {player.team.name}
                  {player.is_on_fire && <span className="ml-2 text-orange-500">🔥</span>}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{player.quotation} cr</p>
                  <p className="text-sm text-gray-600">{player.avg_pts} pts</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlayer(player);
                    setShowAlternatives(true);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Find Alternatives
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 