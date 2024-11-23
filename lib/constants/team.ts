export const POSITION_LIMITS = {
  Center: 2,
  Forward: 4,
  Guard: 4,
  Coach: 1,
} as const;

export const TEAM_PLAYER_LIMIT = 3;
export const MIN_BUDGET = 90;
export const MAX_BUDGET = 100;

export const SORT_OPTIONS = [
  { value: 'quotation', label: 'Credits (Low to High)' },
  { value: '-quotation', label: 'Credits (High to Low)' },
  { value: 'avg_pts', label: 'Average Score (Low to High)' },
  { value: '-avg_pts', label: 'Average Score (High to Low)' },
] as const;

export const POSITIONS = ['Center', 'Forward', 'Guard', 'Coach'] as const; 