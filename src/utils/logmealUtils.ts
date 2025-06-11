import { AnalysisResult, FoodItem, NutrientData } from '../types';

export const transformLogmealResponse = (logmealResponse: any, imageUrl: string): AnalysisResult => {
  const identifiedFoods: FoodItem[] = [];
  let totalCalories = 0;
  const totalNutrients: NutrientData = {
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminB12: 0,
    magnesium: 0,
    potassium: 0,
    omega3: 0,
  };

  if (logmealResponse && logmealResponse.recognition_results) {
    logmealResponse.recognition_results.forEach((item: any) => {
      identifiedFoods.push({
        name: item.name,
        confidence: item.prob || 0,
        portion: item.serving_size_unit || 'N/A',
      });

      if (item.nutrition) {
        totalNutrients.protein += (item.nutrition.protein || 0);
        totalNutrients.carbs += (item.nutrition.carbohydrates || 0);
        totalNutrients.fat += (item.nutrition.fat || 0);
        totalNutrients.fiber += (item.nutrition.fiber || 0);
        totalNutrients.calcium += (item.nutrition.calcium || 0);
        totalNutrients.iron += (item.nutrition.iron || 0);
        totalNutrients.vitaminC += (item.nutrition.vitamin_c || 0);
        totalNutrients.vitaminD += (item.nutrition.vitamin_d || 0);
        totalNutrients.vitaminB12 += (item.nutrition.vitamin_b12 || 0);
        totalNutrients.magnesium += (item.nutrition.magnesium || 0);
        totalNutrients.potassium += (item.nutrition.potassium || 0);
        totalNutrients.omega3 += (item.nutrition.omega_3 || 0);

        totalCalories += (item.nutrition.calories || 0);
      }
    });
  }

  return {
    id: `logmeal-${Date.now()}`,
    timestamp: new Date(),
    imageUrl: imageUrl,
    identifiedFoods: identifiedFoods,
    nutrients: totalNutrients,
    calories: totalCalories,
    deficiencies: [],
    suggestions: [],
    balancedPlateScore: 0,
  };
}; 