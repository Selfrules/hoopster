import React from 'react';
import { PlayerFilters as PlayerFiltersType, PositionName } from '../../lib/types';

interface PlayerFiltersProps {
  onSortChange: (field: string) => void;
  onFilterChange: (filters: PlayerFiltersType) => void;
  currentSort: string;
  currentFilters: PlayerFiltersType;
}

export function PlayerFilters({ onSortChange, onFilterChange, currentSort, currentFilters }: PlayerFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="quotation">Credits (Low to High)</option>
            <option value="-quotation">Credits (High to Low)</option>
            <option value="avg_pts">Average Score (Low to High)</option>
            <option value="-avg_pts">Average Score (High to Low)</option>
          </select>
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <select
            id="position"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={currentFilters.position}
            onChange={(e) => onFilterChange({ 
              ...currentFilters, 
              position: e.target.value as PositionName | '' 
            })}
          >
            <option value="">All Positions</option>
            <option value="Center">Center</option>
            <option value="Forward">Forward</option>
            <option value="Guard">Guard</option>
            <option value="Head Coach">Head Coach</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={currentFilters.onlyAvailable}
              onChange={(e) => onFilterChange({ 
                ...currentFilters, 
                onlyAvailable: e.target.checked 
              })}
            />
            <span className="ml-2 text-sm text-gray-600">Only Available Players</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={currentFilters.onlyOnFire}
              onChange={(e) => onFilterChange({ 
                ...currentFilters, 
                onlyOnFire: e.target.checked 
              })}
            />
            <span className="ml-2 text-sm text-gray-600">Only On Fire Players</span>
          </label>
        </div>
      </div>
    </div>
  );
} 