import { UserProfile, DailyTargets, NutrientData } from '../types';

export const calculateDailyTargets = (profile: UserProfile): DailyTargets => {
  const { sex, lifestyle } = profile;
  
  // Base values for adult males (adjusted for females and lifestyle)
  let baseCalories = 2500;
  let protein = 56; // grams
  let calcium = 1000; // mg
  let iron = 8; // mg
  let vitaminC = 90; // mg
  let vitaminD = 15; // mcg
  let vitaminB12 = 2.4; // mcg
  let magnesium = 400; // mg
  let potassium = 3500; // mg
  let omega3 = 1.6; // grams
  let fiber = 38; // grams

  // Adjust for sex
  if (sex === 'female') {
    baseCalories = 2000;
    protein = 46;
    iron = 18;
    vitaminC = 75;
    magnesium = 310;
    omega3 = 1.1;
    fiber = 25;
  }

  // Adjust for lifestyle
  const activityMultipliers = {
    sedentary: 1.0,
    lightly_active: 1.2,
    moderately_active: 1.4,
    very_active: 1.6,
    pregnant: 1.3,
    breastfeeding: 1.5
  };

  const multiplier = activityMultipliers[lifestyle];
  baseCalories *= multiplier;

  // Special adjustments for pregnancy/breastfeeding
  if (lifestyle === 'pregnant') {
    iron = 27;
    calcium = 1000;
    vitaminD = 15;
    fiber = 28;
  } else if (lifestyle === 'breastfeeding') {
    iron = 9;
    calcium = 1000;
    vitaminC = 120;
    vitaminD = 15;
  }

  return {
    calories: Math.round(baseCalories),
    protein,
    carbs: Math.round(baseCalories * 0.5 / 4), // 50% of calories from carbs
    fat: Math.round(baseCalories * 0.3 / 9), // 30% of calories from fat
    fiber,
    calcium,
    iron,
    vitaminC,
    vitaminD,
    vitaminB12,
    magnesium,
    potassium,
    omega3
  };
};

export const calculateDeficiencies = (nutrients: NutrientData, targets: DailyTargets): string[] => {
  const deficiencies: string[] = [];
  const threshold = 0.7; // 70% of target is considered adequate

  if (nutrients.protein < targets.protein * threshold) deficiencies.push('Protein');
  if (nutrients.fiber < targets.fiber * threshold) deficiencies.push('Fiber');
  if (nutrients.calcium < targets.calcium * threshold) deficiencies.push('Calcium');
  if (nutrients.iron < targets.iron * threshold) deficiencies.push('Iron');
  if (nutrients.vitaminC < targets.vitaminC * threshold) deficiencies.push('Vitamin C');
  if (nutrients.vitaminD < targets.vitaminD * threshold) deficiencies.push('Vitamin D');
  if (nutrients.vitaminB12 < targets.vitaminB12 * threshold) deficiencies.push('Vitamin B12');
  if (nutrients.magnesium < targets.magnesium * threshold) deficiencies.push('Magnesium');
  if (nutrients.potassium < targets.potassium * threshold) deficiencies.push('Potassium');
  if (nutrients.omega3 < targets.omega3 * threshold) deficiencies.push('Omega-3');

  return deficiencies;
};

export const generateSuggestions = (deficiencies: string[]): string[] => {
  const suggestionMap: Record<string, string> = {
    'Protein': 'Add lean meats, fish, eggs, legumes, or Greek yogurt',
    'Fiber': 'Include more whole grains, fruits, vegetables, and legumes',
    'Calcium': 'Add dairy products, leafy greens, or fortified plant milks',
    'Iron': 'Include red meat, spinach, lentils, or fortified cereals',
    'Vitamin C': 'Add citrus fruits, berries, bell peppers, or broccoli',
    'Vitamin D': 'Consider fortified foods, fatty fish, or sun exposure',
    'Vitamin B12': 'Include meat, fish, dairy, or fortified plant foods',
    'Magnesium': 'Add nuts, seeds, whole grains, or dark leafy greens',
    'Potassium': 'Include bananas, potatoes, beans, or avocados',
    'Omega-3': 'Add fatty fish, walnuts, flaxseeds, or chia seeds'
  };

  return deficiencies.map(deficiency => suggestionMap[deficiency] || '');
};

export const calculateBalancedPlateScore = (nutrients: NutrientData, targets: DailyTargets): number => {
  const scores: number[] = [];
  
  // Calculate percentage of target met for each nutrient (capped at 100%)
  scores.push(Math.min(100, (nutrients.protein / targets.protein) * 100));
  scores.push(Math.min(100, (nutrients.fiber / targets.fiber) * 100));
  scores.push(Math.min(100, (nutrients.calcium / targets.calcium) * 100));
  scores.push(Math.min(100, (nutrients.iron / targets.iron) * 100));
  scores.push(Math.min(100, (nutrients.vitaminC / targets.vitaminC) * 100));
  scores.push(Math.min(100, (nutrients.vitaminD / targets.vitaminD) * 100));
  scores.push(Math.min(100, (nutrients.vitaminB12 / targets.vitaminB12) * 100));
  scores.push(Math.min(100, (nutrients.magnesium / targets.magnesium) * 100));
  scores.push(Math.min(100, (nutrients.potassium / targets.potassium) * 100));
  scores.push(Math.min(100, (nutrients.omega3 / targets.omega3) * 100));

  // Return average score
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};