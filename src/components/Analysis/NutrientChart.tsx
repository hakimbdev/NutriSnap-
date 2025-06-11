import React from 'react';
import { NutrientData, DailyTargets } from '../../types';

interface NutrientChartProps {
  nutrients: NutrientData;
  targets: DailyTargets;
}

const NutrientChart: React.FC<NutrientChartProps> = ({ nutrients, targets }) => {
  const nutrientItems = [
    { key: 'protein', label: 'Protein', unit: 'g', color: 'bg-blue-500' },
    { key: 'carbs', label: 'Carbs', unit: 'g', color: 'bg-green-500' },
    { key: 'fat', label: 'Fat', unit: 'g', color: 'bg-yellow-500' },
    { key: 'fiber', label: 'Fiber', unit: 'g', color: 'bg-purple-500' },
    { key: 'calcium', label: 'Calcium', unit: 'mg', color: 'bg-indigo-500' },
    { key: 'iron', label: 'Iron', unit: 'mg', color: 'bg-red-500' },
    { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', color: 'bg-orange-500' },
    { key: 'magnesium', label: 'Magnesium', unit: 'mg', color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-4">
      {nutrientItems.map(({ key, label, unit, color }) => {
        const current = nutrients[key as keyof NutrientData];
        const target = targets[key as keyof DailyTargets];
        const percentage = Math.min(100, (current / target) * 100);
        
        return (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className="text-sm text-gray-600">
                {current.toFixed(1)}{unit} / {target}{unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-right">
              {percentage.toFixed(0)}% of daily target
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutrientChart;