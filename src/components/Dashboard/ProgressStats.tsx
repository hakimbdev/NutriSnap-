import React from 'react';
import { DailyTargets } from '../../types';
import { Flame, Target, TrendingUp } from 'lucide-react';

interface ProgressStatsProps {
  todayTotals: any;
  targets: DailyTargets;
  mealCount: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ todayTotals, targets, mealCount }) => {
  const caloriesPercentage = todayTotals.calories ? (todayTotals.calories / targets.calories) * 100 : 0;
  const proteinPercentage = todayTotals.protein ? (todayTotals.protein / targets.protein) * 100 : 0;

  const stats = [
    {
      label: 'Calories Today',
      value: todayTotals.calories || 0,
      target: targets.calories,
      percentage: caloriesPercentage,
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'Protein',
      value: `${(todayTotals.protein || 0).toFixed(1)}g`,
      target: `${targets.protein}g`,
      percentage: proteinPercentage,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Meals Logged',
      value: mealCount,
      target: '3-5',
      percentage: (mealCount / 4) * 100,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-xs text-gray-500">{stat.percentage.toFixed(0)}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">Target: {stat.target}</p>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${stat.color.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min(100, stat.percentage)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressStats;