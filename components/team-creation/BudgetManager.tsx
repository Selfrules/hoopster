import React from 'react';

interface BudgetManagerProps {
  totalBudget: number;
  usedBudget: number;
  onBudgetChange: (newBudget: number) => void;
}

export function BudgetManager({ totalBudget, usedBudget, onBudgetChange }: BudgetManagerProps) {
  const remainingBudget = totalBudget - usedBudget;
  const budgetPercentage = Math.min((usedBudget / totalBudget) * 100, 100);

  return (
    <div className="budget-manager">
      <div className="budget-manager__header">
        <h3 className="budget-manager__title">Budget Manager</h3>
        <div className="budget-manager__controls">
          <label htmlFor="budget-range" className="sr-only">
            Adjust total budget
          </label>
          <input
            id="budget-range"
            type="range"
            min={90}
            max={100}
            value={totalBudget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="budget-manager__range"
          />
          <span className="budget-manager__credits">
            {totalBudget} credits
          </span>
        </div>
      </div>

      <div className="budget-manager__stats">
        <div className="budget-manager__stat-row">
          <span>Used Budget:</span>
          <span className="budget-manager__stat-value">
            {usedBudget.toFixed(1)} credits
          </span>
        </div>
        <div className="budget-manager__stat-row">
          <span>Remaining:</span>
          <span className={`budget-manager__stat-value ${
            remainingBudget < 0 ? 'budget-manager__stat-value--negative' : 'budget-manager__stat-value--positive'
          }`}>
            {remainingBudget.toFixed(1)} credits
          </span>
        </div>
        
        <div className="budget-manager__progress">
          <div className="budget-manager__progress-bar">
            <div
              className={`budget-manager__progress-fill ${
                remainingBudget < 0 ? 'budget-manager__progress-fill--negative' : 'budget-manager__progress-fill--positive'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 