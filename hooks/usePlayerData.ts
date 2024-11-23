import { useState, useEffect } from 'react';

interface Position {
  id: number;
  name: string;
}

interface Opponent {
  id: number;
  name: string;
  abbreviation: string;
}

interface Round {
  id: number;
  number: number;
}

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  quotation: number;
  jersey: string;
  avg_pts: number;
  position: Position;
  is_injured: boolean;
  is_on_fire: boolean;
  opponent: Opponent;
  popularity: number;
  probability_of_playing: number;
  started_from_bench: boolean;
  round: Round;
  fantasy_team: null | any;
  label: string;
}

export function usePlayerData(leagueId: number, matchdayId: number) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `https://fantaking-api.dunkest.com/api/v1/players-lists/${leagueId}/matchdays/${matchdayId}/players?per_page=-1&page=1&sort_by=quotation&sort_order=desc`,
          {
            headers: {
              'Authorization': 'Bearer 1929597|4PoJUcbEysIam1VobJlNOlXn8QB0Tm4V3NzCiQJW675f9215',
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'Origin': 'https://fantasy.dunkest.com',
              'Referer': 'https://fantasy.dunkest.com/',
              'sec-fetch-site': 'same-site',
              'sec-fetch-mode': 'cors',
              'sec-fetch-dest': 'empty'
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPlayers(data.data || []);
      } catch (error) {
        console.error('Error fetching player data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [leagueId, matchdayId]);

  return { players, isLoading, error };
} 