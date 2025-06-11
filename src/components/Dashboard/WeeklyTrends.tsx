import React from 'react';
import { AnalysisResult, DailyTargets } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface WeeklyTrendsProps {
  analyses: AnalysisResult[];
  targets: DailyTargets;
}

const WeeklyTrends: React.FC<WeeklyTrendsProps> = ({ analyses, targets }) => {
  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    const dayAnalyses = analyses.filter(analysis => {
      const analysisDate = startOfDay(new Date(analysis.timestamp));
      return analysisDate.getTime() === date.getTime();
    });

    // Calculate daily totals
    const dailyTotals = dayAnalyses.reduce((totals, analysis) => {
      Object.keys(analysis.nutrients).forEach(key => {
        const nutrientKey = key as keyof typeof analysis.nutrients;
        totals[nutrientKey] = (totals[nutrientKey] || 0) + analysis.nutrients[nutrientKey];
      });
      totals.calories = (totals.calories || 0) + analysis.calories;
      return totals;
    }, {} as any);

    return {
      date,
      totals: dailyTotals,
      mealCount: dayAnalyses.length
    };
  });

  // Calculate key nutrient trends
  const keyNutrients = [
    { key: 'protein', label: 'Protein', unit: 'g', target: targets.protein },
    { key: 'fiber', label: 'Fiber', unit: 'g', target: targets.fiber },
    { key: 'calcium', label: 'Calcium', unit: 'mg', target: targets.calcium },
    { key: 'iron', label: 'Iron', unit: 'mg', target: targets.iron }
  ];

  const getTrendIcon = (values: number[]) => {
    if (values.length < 2) return Minus;
    const recent = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlier = values.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, values.length - 3);
    
    if (recent > earlier * 1.1) return TrendingUp;
    if (recent < earlier * 0.9) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (values: number[]) => {
    if (values.length < 2) return 'text-gray-500';
    const recent = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlier = values.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, values.length - 3);
    
    if (recent > earlier * 1.1) return 'text-green-600';
    if (recent < earlier * 0.9) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
      
      {/* Daily Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Activity</h4>
        <div className="flex justify-between items-end space-x-1">
          {last7Days.map((day, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="mb-2">
                <div 
                  className="bg-primary-200 rounded-t mx-auto transition-all duration-300"
                  style={{ 
                    height: `${Math.max(4, (day.mealCount / 5) * 40)}px`,
                    width: '100%'
                  }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {format(day.date, 'EEE')}
              </div>
              <div className="text-xs text-gray-500">
                {day.mealCount}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">Meals per day</div>
      </div>

      {/* Nutrient Trends */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Nutrient Trends</h4>
        {keyNutrients.map(({ key, label, unit, target }) => {
          const values = last7Days.map(day => day.totals[key] || 0);
          const average = values.reduce((a, b) => a + b, 0) / values.length;
          const percentage = (average / target) * 100;
          const TrendIcon = getTrendIcon(values);
          const trendColor = getTrendColor(values);

          return (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <div className="text-sm text-gray-600">
                    Avg: {average.toFixed(1)}{unit} / {target}{unit}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  percentage >= 80 ? 'text-green-600' : 
                  percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {percentage.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">of target</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyTrends;