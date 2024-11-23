import React from 'react';
import { useMatchdaySchedule } from '../../hooks/useMatchdaySchedule';

interface MatchdayScheduleProps {
  leagueId: number;
  matchdayId: number;
}

export function MatchdaySchedule({ leagueId, matchdayId }: MatchdayScheduleProps) {
  const { schedule, isLoading, error } = useMatchdaySchedule(leagueId, matchdayId);

  if (isLoading) {
    return <div className="text-center">Loading schedule...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!schedule) {
    return <div className="text-center">No schedule available.</div>;
  }

  return (
    <div className="matchday-schedule p-4">
      <h2 className="text-2xl font-bold mb-4">Matchday {schedule.number}</h2>
      
      {/* Resting Teams */}
      {schedule.resting_teams.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Resting Teams</h3>
          <div className="flex gap-2 flex-wrap">
            {schedule.resting_teams.map(team => (
              <span key={team.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {team.name} ({team.abbreviation})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rounds */}
      <div className="space-y-6">
        {schedule.rounds.map(round => (
          <div key={round.id} className="round">
            <h3 className="text-lg font-semibold mb-3">Round {round.number}</h3>
            <div className="grid gap-4">
              {round.matches.map(match => (
                <div key={match.id} className="match p-4 border rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(match.started_at).toLocaleString()}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="team-info">
                      <span className="font-medium">{match.home_team.abbreviation}</span>
                      {match.home_team.score !== null && (
                        <span className="ml-2">{match.home_team.score}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 mx-4">vs</span>
                    <div className="team-info text-right">
                      <span className="font-medium">{match.away_team.abbreviation}</span>
                      {match.away_team.score !== null && (
                        <span className="ml-2">{match.away_team.score}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Status: <span className="capitalize">{match.status}</span>
                    {match.ot && <span className="ml-2">(OT)</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 