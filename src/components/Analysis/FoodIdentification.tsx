import React from 'react';
import { FoodItem } from '../../types';
import { Utensils } from 'lucide-react';

interface FoodIdentificationProps {
  foods: FoodItem[];
  calories: number;
}

const FoodIdentification: React.FC<FoodIdentificationProps> = ({ foods, calories }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Utensils className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Identified Foods</h3>
      </div>
      
      <div className="space-y-3 mb-4">
        {foods.map((food, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{food.name}</h4>
              <p className="text-sm text-gray-600">Portion: {food.portion}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-primary-600">
                {Math.round(food.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-500">confidence</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Calories</span>
          <span className="text-lg font-bold text-primary-600">{calories} kcal</span>
        </div>
      </div>
    </div>
  );
};

export default FoodIdentification;