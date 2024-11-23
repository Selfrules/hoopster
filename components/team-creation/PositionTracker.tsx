import React from 'react';

interface PositionLimits {
  Center: number;
  Forward: number;
  Guard: number;
  Coach: number;
}

interface PositionCount {
  Center: number;
  Forward: number;
  Guard: number;
  Coach: number;
}

interface PositionTrackerProps {
  currentCount: PositionCount;
  limits: PositionLimits;
}

export function PositionTracker({ currentCount, limits }: PositionTrackerProps) {
  const positions = ['Center', 'Forward', 'Guard', 'Coach'] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Requirements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {positions.map(position => (
          <div key={position} className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">{position}</span>
              <span className={`text-sm font-bold ${
                currentCount[position] === limits[position]
                  ? 'text-green-500'
                  : currentCount[position] > limits[position]
                  ? 'text-red-500'
                  : 'text-gray-900'
              }`}>
                {currentCount[position]}/{limits[position]}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  currentCount[position] === limits[position]
                    ? 'bg-green-500'
                    : currentCount[position] > limits[position]
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min((currentCount[position] / limits[position]) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 