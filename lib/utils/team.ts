import { Player } from '../types';

export function formatPlayerName(player: Player): string {
  return `${player.first_name} ${player.last_name}`;
}

export function calculateTotalCost(players: Player[]): number {
  return players.reduce((sum, player) => sum + player.quotation, 0);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getPlayerStatus(player: Player) {
  if (player.is_injured) return 'injured';
  if (player.is_on_fire) return 'on-fire';
  if (player.started_from_bench) return 'bench';
  return 'available';
} 