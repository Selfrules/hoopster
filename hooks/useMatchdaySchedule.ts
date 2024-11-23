import { useState, useEffect } from 'react';

interface Team {
  id: number;
  name: string;
  abbreviation: string;
  score?: number | null;
  is_valid?: boolean;
}

interface Match {
  id: number;
  status: string;
  ot: boolean;
  started_at: string;
  home_team: Team;
  away_team: Team;
}

interface Round {
  id: number;
  number: number;
  matches: Match[];
}

interface MatchdayData {
  id: number;
  number: number;
  resting_teams: Team[];
  rounds: Round[];
}

export function useMatchdaySchedule(leagueId: number, matchdayId: number) {
  const [schedule, setSchedule] = useState<MatchdayData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `https://fantaking-api.dunkest.com/api/v1/schedules/${leagueId}/matchdays/${matchdayId}`,
          {
            headers: {
              'Authorization': 'Bearer 1929597|4PoJUcbEysIam1VobJlNOlXn8QB0Tm4V3NzCiQJW675f9215',
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'Origin': 'https://fantasy.dunkest.com',
              'Referer': 'https://fantasy.dunkest.com/',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        setSchedule(responseData.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [leagueId, matchdayId]);

  return { schedule, isLoading, error };
} 