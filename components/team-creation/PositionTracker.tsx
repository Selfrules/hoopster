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

  const getProgressWidth = (current: number, limit: number) => {
    return `${Math.min((current / limit) * 100, 100)}%`;
  };

  return (
    <div className="position-tracker">
      <h3 className="position-tracker__title">Position Requirements</h3>
      <div className="position-tracker__grid">
        {positions.map(position => (
          <div key={position} className="position-tracker__position">
            <div className="position-tracker__header">
              <span className="position-tracker__label">{position}</span>
              <span className={`position-tracker__count ${
                currentCount[position] === limits[position]
                  ? 'position-tracker__count--complete'
                  : currentCount[position] > limits[position]
                  ? 'position-tracker__count--over'
                  : 'position-tracker__count--under'
              }`}>
                {currentCount[position]}/{limits[position]}
              </span>
            </div>
            <div className="position-tracker__progress">
              <div
                className={`position-tracker__progress-fill ${
                  currentCount[position] === limits[position]
                    ? 'position-tracker__progress-fill--complete'
                    : currentCount[position] > limits[position]
                    ? 'position-tracker__progress-fill--over'
                    : 'position-tracker__progress-fill--under'
                }`}
                style={{ width: getProgressWidth(currentCount[position], limits[position]) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 