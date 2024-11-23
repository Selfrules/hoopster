export const POSITIONS = ['Center', 'Forward', 'Guard', 'Coach'] as const;
export type PositionName = (typeof POSITIONS)[number];

export interface Position {
  name: PositionName;
}

export interface Team {
  name: string;
}

export const SORTABLE_FIELDS = [
  'quotation',
  'avg_pts',
  'probability_of_playing',
  'popularity'
] as const;
export type SortableField = (typeof SORTABLE_FIELDS)[number];

export type SortDirection = '-' | '';
export type SortOption = `${SortDirection}${SortableField}`;

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: Position;
  team: Team;
  quotation: number;
  avg_pts: number;
  is_injured: boolean;
  is_on_fire: boolean;
  started_from_bench: boolean;
  probability_of_playing: number;
  popularity: number;
  opponent?: {
    abbreviation: string;
  };
  jersey: number;
}

export interface PositionCount extends Record<PositionName, number> {}

export interface PlayerFilters {
  position: PositionName | '';
  onlyAvailable: boolean;
  onlyOnFire: boolean;
}

export interface TeamState {
  selectedPlayers: number[];
  budget: number;
  filters: PlayerFilters;
  sort: SortOption;
} 