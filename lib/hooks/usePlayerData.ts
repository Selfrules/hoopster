import { useApiQuery } from './useApi';
import { Player } from '../types';

interface PlayersResponse {
  data: Player[];
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

export function usePlayerData(leagueId: number, matchdayId: number) {
  const result = useApiQuery<PlayersResponse>(
    `/players-lists/${leagueId}/matchdays/${matchdayId}/players`,
    {
      enabled: !!leagueId && !!matchdayId,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    }
  );

  return {
    players: result.data?.data || [],
    isLoading: result.isLoading,
    error: result.error?.message || null
  };
} 