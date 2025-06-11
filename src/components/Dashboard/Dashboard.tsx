import React from 'react';
import { AnalysisResult, UserProfile } from '../../types';
import { calculateDailyTargets } from '../../utils/nutritionCalculator';
import MealHistory from './MealHistory';
import WeeklyTrends from './WeeklyTrends';
import ProgressStats from './ProgressStats';

interface DashboardProps {
  analyses: AnalysisResult[];
  userProfile: UserProfile;
  onViewAnalysis: (analysis: AnalysisResult) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analyses, userProfile, onViewAnalysis }) => {
  const targets = calculateDailyTargets(userProfile);
  
  // Get today's analyses
  const today = new Date();
  const todayAnalyses = analyses.filter(analysis => {
    const analysisDate = new Date(analysis.timestamp);
    return analysisDate.toDateString() === today.toDateString();
  });

  // Calculate today's totals
  const todayTotals = todayAnalyses.reduce((totals, analysis) => {
    Object.keys(analysis.nutrients).forEach(key => {
      const nutrientKey = key as keyof typeof analysis.nutrients;
      totals[nutrientKey] = (totals[nutrientKey] || 0) + analysis.nutrients[nutrientKey];
    });
    totals.calories = (totals.calories || 0) + analysis.calories;
    return totals;
  }, {} as any);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Nutrition Dashboard</h2>
        <p className="text-gray-600">Track your daily nutrition and progress</p>
      </div>

      {/* Progress Stats */}
      <ProgressStats 
        todayTotals={todayTotals}
        targets={targets}
        mealCount={todayAnalyses.length}
      />

      {/* Weekly Trends */}
      <WeeklyTrends analyses={analyses} targets={targets} />

      {/* Meal History */}
      <MealHistory 
        analyses={analyses.slice(0, 10)} // Show last 10 meals
        onViewAnalysis={onViewAnalysis}
      />
    </div>
  );
};

export default Dashboard;