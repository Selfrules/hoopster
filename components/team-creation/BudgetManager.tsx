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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget Manager</h3>
        <div className="flex items-center space-x-4">
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
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Budget slider"
            aria-valuemin={90}
            aria-valuemax={100}
            aria-valuenow={totalBudget}
            title={`Current budget: ${totalBudget} credits`}
          />
          <span className="text-sm font-medium text-gray-600">
            {totalBudget} credits
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Used Budget:</span>
          <span className="font-medium">{usedBudget.toFixed(1)} credits</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Remaining:</span>
          <span className={`font-medium ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {remainingBudget.toFixed(1)} credits
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
            <div
              className={`
                flex flex-col text-center whitespace-nowrap text-white justify-center
                ${remainingBudget < 0 ? 'bg-red-500' : 'bg-green-500'}
                transition-all duration-300 ease-in-out
                ${`w-[${budgetPercentage}%]`}
              `}
              role="progressbar"
              aria-valuenow={Math.round(budgetPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Budget usage progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 