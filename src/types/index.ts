export interface NutrientData {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  vitaminD: number;
  vitaminB12: number;
  magnesium: number;
  potassium: number;
  omega3: number;
}

export interface FoodItem {
  name: string;
  confidence: number;
  portion: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  imageUrl: string;
  identifiedFoods: FoodItem[];
  nutrients: NutrientData;
  deficiencies: string[];
  suggestions: string[];
  balancedPlateScore: number;
  calories: number;
}

export interface UserProfile {
  age: number;
  sex: 'male' | 'female';
  lifestyle: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'pregnant' | 'breastfeeding';
  weight?: number;
  height?: number;
}

export interface DailyTargets {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  vitaminD: number;
  vitaminB12: number;
  magnesium: number;
  potassium: number;
  omega3: number;
  calories: number;
}

export interface WeeklyTrend {
  nutrient: string;
  values: number[];
  target: number;
  status: 'low' | 'adequate' | 'high';
}