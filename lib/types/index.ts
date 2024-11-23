// Centralized type definitions
export interface Position {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  abbreviation: string;
}

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  quotation: number;
  jersey: string;
  avg_pts: number;
  position: Position;
  team: Team;
  is_injured: boolean;
  is_on_fire: boolean;
  opponent?: Team;
  popularity: number;
  probability_of_playing: number;
  started_from_bench: boolean;
}

export interface PlayerFilters {
  position: string;
  onlyAvailable: boolean;
  onlyOnFire: boolean;
}

export type SortOption = 'quotation' | '-quotation' | 'avg_pts' | '-avg_pts';

export interface TeamState {
  selectedPlayers: number[];
  budget: number;
  filters: PlayerFilters;
  sort: SortOption;
}

export interface ApiConfig {
  baseUrl: string;
  token: string;
  headers: Record<string, string>;
} 