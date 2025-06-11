import React from 'react';
import { AnalysisResult } from '../../types';
import { Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface MealHistoryProps {
  analyses: AnalysisResult[];
  onViewAnalysis: (analysis: AnalysisResult) => void;
}

const MealHistory: React.FC<MealHistoryProps> = ({ analyses, onViewAnalysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (analyses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No meals analyzed yet</p>
          <p className="text-sm text-gray-500 mt-1">Start by taking a photo of your meal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</h3>
      
      <div className="space-y-3">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onViewAnalysis(analysis)}
          >
            <img
              src={analysis.imageUrl}
              alt="Meal"
              className="w-12 h-12 object-cover rounded-lg"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {analysis.identifiedFoods.slice(0, 2).map(food => food.name).join(', ')}
                  {analysis.identifiedFoods.length > 2 && ` +${analysis.identifiedFoods.length - 2} more`}
                </p>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(analysis.balancedPlateScore)}`}>
                  {analysis.balancedPlateScore}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{format(new Date(analysis.timestamp), 'MMM d, h:mm a')}</span>
                  <span>•</span>
                  <span>{analysis.calories} kcal</span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {analyses.length >= 10 && (
        <div className="text-center mt-4">
          <button className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
            View All Meals
          </button>
        </div>
      )}
    </div>
  );
};

export default MealHistory;