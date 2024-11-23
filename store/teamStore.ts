import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeamState, PlayerFilters } from '../lib/types';

interface TeamStore extends TeamState {
  addPlayer: (playerId: number) => void;
  removePlayer: (playerId: number) => void;
  updateBudget: (budget: number) => void;
  updateFilters: (filters: Partial<PlayerFilters>) => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      selectedPlayers: [],
      budget: 100,
      filters: {
        position: '',
        onlyAvailable: false,
        onlyOnFire: false,
      },
      sort: '-quotation',

      addPlayer: (playerId: number) =>
        set((state: TeamStore) => ({
          selectedPlayers: [...state.selectedPlayers, playerId],
        })),

      removePlayer: (playerId: number) =>
        set((state: TeamStore) => ({
          selectedPlayers: state.selectedPlayers.filter((id) => id !== playerId),
        })),

      updateBudget: (budget: number) => set({ budget }),
      updateFilters: (filters: Partial<PlayerFilters>) =>
        set((state: TeamStore) => ({
          filters: { ...state.filters, ...filters },
        })),
    }),
    {
      name: 'team-storage',
    }
  )
); 