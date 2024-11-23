import { useMemo } from 'react';
import { Player, PlayerFilters, SortOption } from '../types';

export function usePlayerFiltering(
  players: Player[],
  filters: PlayerFilters,
  sort: SortOption
) {
  return useMemo(() => {
    return players
      .filter(player => {
        if (filters.position && player.position.name !== filters.position) {
          return false;
        }
        if (filters.onlyAvailable && player.is_injured) {
          return false;
        }
        if (filters.onlyOnFire && !player.is_on_fire) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const [field, order] = sort.startsWith('-')
          ? [sort.slice(1) as keyof Player, -1]
          : [sort as keyof Player, 1];
        
        const aValue = a[field] as number;
        const bValue = b[field] as number;
        
        return (aValue - bValue) * order;
      });
  }, [players, filters, sort]);
} 