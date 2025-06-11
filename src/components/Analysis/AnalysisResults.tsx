import React from 'react';
import { ArrowLeft, Award, AlertTriangle, Lightbulb } from 'lucide-react';
import { AnalysisResult, UserProfile } from '../../types';
import { calculateDeficiencies, generateSuggestions, calculateBalancedPlateScore, calculateDailyTargets } from '../../utils/nutritionCalculator';
import NutrientChart from './NutrientChart';
import FoodIdentification from './FoodIdentification';

interface AnalysisResultsProps {
  result: AnalysisResult;
  userProfile: UserProfile;
  onBack: () => void;
  onSave: (result: AnalysisResult) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  result, 
  userProfile, 
  onBack, 
  onSave 
}) => {
  const targets = calculateDailyTargets(userProfile);
  const deficiencies = calculateDeficiencies(result.nutrients, targets);
  const suggestions = generateSuggestions(deficiencies);
  const balancedPlateScore = calculateBalancedPlateScore(result.nutrients, targets);

  // Update result with calculated values
  const updatedResult = {
    ...result,
    deficiencies,
    suggestions,
    balancedPlateScore
  };

  const handleSave = () => {
    onSave(updatedResult);
    onBack();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary-600';
    if (score >= 60) return 'text-accent-600';
    return 'text-secondary-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-primary-100';
    if (score >= 60) return 'bg-accent-100';
    return 'bg-secondary-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Save Analysis
        </button>
      </div>

      {/* Meal Image */}
      <div className="relative">
        <img
          src={result.imageUrl}
          alt="Analyzed meal"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute top-4 right-4">
          <div className={`${getScoreBg(balancedPlateScore)} rounded-full p-3`}>
            <Award className={`w-6 h-6 ${getScoreColor(balancedPlateScore)}`} />
          </div>
        </div>
      </div>

      {/* Balanced Plate Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Balanced Plate Score</h3>
          <div className={`text-4xl font-bold ${getScoreColor(balancedPlateScore)} mb-2`}>
            {balancedPlateScore}/100
          </div>
          <p className="text-gray-600">
            {balancedPlateScore >= 80 ? 'Excellent nutritional balance!' :
             balancedPlateScore >= 60 ? 'Good balance with room for improvement' :
             'Consider adding more nutrient-dense foods'}
          </p>
        </div>
      </div>

      {/* Food Identification */}
      <FoodIdentification foods={result.identifiedFoods} calories={result.calories} />

      {/* Nutrient Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrient Analysis</h3>
        <NutrientChart nutrients={result.nutrients} targets={targets} />
      </div>

      {/* Deficiencies Alert */}
      {deficiencies.length > 0 && (
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-secondary-800 mb-2">Potential Deficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {deficiencies.map((deficiency, index) => (
                  <span
                    key={index}
                    className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-sm"
                  >
                    {deficiency}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-accent-800 mb-2">Nutritional Suggestions</h4>
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-accent-700 text-sm">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;