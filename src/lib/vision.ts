import { supabase } from './supabase'
import { addMealWithVision } from '@/lib/db'

const CLOUD_VISION_API_KEY = '86d04d0314945032c7a60f2b5eb48ad65919f6ab'
const CLOUD_VISION_API_URL = 'https://api.cloudvision.ai/v1/analyze'

// Enhanced food database with more detailed nutritional information
const FOOD_DATABASE = {
  // Proteins
  'chicken breast': { 
    calories: 165, 
    proteins: 31, 
    carbs: 0, 
    fats: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    potassium: 256,
    vitamins: { A: 0, C: 0, D: 0, E: 0.2, K: 0 },
    minerals: { calcium: 11, iron: 0.7, magnesium: 29, zinc: 1.0 }
  },
  'chicken': { 
    calories: 165, 
    proteins: 31, 
    carbs: 0, 
    fats: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    potassium: 256,
    vitamins: { A: 0, C: 0, D: 0, E: 0.2, K: 0 },
    minerals: { calcium: 11, iron: 0.7, magnesium: 29, zinc: 1.0 }
  },
  'beef': { 
    calories: 250, 
    proteins: 26, 
    carbs: 0, 
    fats: 17,
    fiber: 0,
    sugar: 0,
    sodium: 65,
    potassium: 318,
    vitamins: { A: 0, C: 0, D: 0, E: 0.4, K: 1.6 },
    minerals: { calcium: 12, iron: 2.6, magnesium: 21, zinc: 6.3 }
  },
  'fish': { 
    calories: 120, 
    proteins: 22, 
    carbs: 0, 
    fats: 3.5,
    fiber: 0,
    sugar: 0,
    sodium: 61,
    potassium: 384,
    vitamins: { A: 0, C: 0, D: 4.2, E: 0.6, K: 0.1 },
    minerals: { calcium: 9, iron: 0.3, magnesium: 32, zinc: 0.6 }
  },
  'salmon': { 
    calories: 208, 
    proteins: 22, 
    carbs: 0, 
    fats: 13,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    potassium: 363,
    vitamins: { A: 0, C: 0, D: 13.1, E: 3.6, K: 0.7 },
    minerals: { calcium: 9, iron: 0.3, magnesium: 27, zinc: 0.6 }
  },
  'tofu': { 
    calories: 76, 
    proteins: 8, 
    carbs: 1.9, 
    fats: 4.8,
    fiber: 0.3,
    sugar: 0.6,
    sodium: 7,
    potassium: 121,
    vitamins: { A: 0, C: 0, D: 0, E: 0.1, K: 2.4 },
    minerals: { calcium: 350, iron: 5.4, magnesium: 30, zinc: 0.8 }
  },
  'eggs': { 
    calories: 155, 
    proteins: 12.6, 
    carbs: 1.1, 
    fats: 11.3,
    fiber: 0,
    sugar: 1.1,
    sodium: 124,
    potassium: 126,
    vitamins: { A: 160, C: 0, D: 2, E: 1.1, K: 0.3 },
    minerals: { calcium: 56, iron: 1.8, magnesium: 12, zinc: 1.3 }
  },
  
  // Carbs
  'rice': { 
    calories: 130, 
    proteins: 2.7, 
    carbs: 28, 
    fats: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1,
    potassium: 35,
    vitamins: { A: 0, C: 0, D: 0, E: 0.1, K: 0 },
    minerals: { calcium: 10, iron: 0.2, magnesium: 12, zinc: 0.5 }
  },
  'pasta': { 
    calories: 158, 
    proteins: 5.8, 
    carbs: 31, 
    fats: 0.9,
    fiber: 1.8,
    sugar: 0.6,
    sodium: 1,
    potassium: 44,
    vitamins: { A: 0, C: 0, D: 0, E: 0.1, K: 0 },
    minerals: { calcium: 7, iron: 1.3, magnesium: 18, zinc: 0.5 }
  },
  'bread': { 
    calories: 265, 
    proteins: 9, 
    carbs: 49, 
    fats: 3.2,
    fiber: 2.7,
    sugar: 5,
    sodium: 491,
    potassium: 115,
    vitamins: { A: 0, C: 0, D: 0, E: 0.3, K: 1.2 },
    minerals: { calcium: 260, iron: 3.6, magnesium: 25, zinc: 0.8 }
  },
  
  // Vegetables
  'salad': { 
    calories: 20, 
    proteins: 1.2, 
    carbs: 3.8, 
    fats: 0.2,
    fiber: 1.2,
    sugar: 2.8,
    sodium: 10,
    potassium: 194,
    vitamins: { A: 7405, C: 9.2, D: 0, E: 0.3, K: 126.3 },
    minerals: { calcium: 36, iron: 0.9, magnesium: 13, zinc: 0.2 }
  },
  'broccoli': { 
    calories: 34, 
    proteins: 2.8, 
    carbs: 6.6, 
    fats: 0.4,
    fiber: 2.6,
    sugar: 1.7,
    sodium: 33,
    potassium: 316,
    vitamins: { A: 623, C: 89.2, D: 0, E: 0.8, K: 101.6 },
    minerals: { calcium: 47, iron: 0.7, magnesium: 21, zinc: 0.4 }
  },
  
  // Fruits
  'apple': { 
    calories: 52, 
    proteins: 0.3, 
    carbs: 14, 
    fats: 0.2,
    fiber: 2.4,
    sugar: 10,
    sodium: 1,
    potassium: 107,
    vitamins: { A: 54, C: 4.6, D: 0, E: 0.2, K: 2.2 },
    minerals: { calcium: 6, iron: 0.1, magnesium: 5, zinc: 0 }
  },
  'banana': { 
    calories: 89, 
    proteins: 1.1, 
    carbs: 22.8, 
    fats: 0.3,
    fiber: 2.6,
    sugar: 12.2,
    sodium: 1,
    potassium: 358,
    vitamins: { A: 64, C: 8.7, D: 0, E: 0.1, K: 0.5 },
    minerals: { calcium: 5, iron: 0.3, magnesium: 27, zinc: 0.2 }
  },
  
  // Dairy
  'milk': { 
    calories: 42, 
    proteins: 3.4, 
    carbs: 5, 
    fats: 1,
    fiber: 0,
    sugar: 5,
    sodium: 44,
    potassium: 150,
    vitamins: { A: 46, C: 0, D: 1.2, E: 0.1, K: 0.2 },
    minerals: { calcium: 125, iron: 0, magnesium: 11, zinc: 0.4 }
  },
  'yogurt': { 
    calories: 59, 
    proteins: 3.5, 
    carbs: 4.7, 
    fats: 3.3,
    fiber: 0,
    sugar: 4.7,
    sodium: 36,
    potassium: 141,
    vitamins: { A: 27, C: 0.5, D: 0.1, E: 0.1, K: 0.2 },
    minerals: { calcium: 121, iron: 0.1, magnesium: 12, zinc: 0.5 }
  }
} as const

interface VisionAnalysisResult {
  labels: Array<{
    name: string
    confidence: number
  }>
  objects: Array<{
    name: string
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  text: Array<{
    text: string
    confidence: number
  }>
}

export async function analyzeMealImage(imageFile: File): Promise<VisionAnalysisResult> {
  // First upload the image to Supabase storage
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `temp/${Date.now()}.${fileExt}`
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('meal-images')
    .upload(fileName, imageFile)
  
  if (uploadError) throw uploadError
  
  // Get the public URL of the uploaded image
  const { data: { publicUrl } } = supabase.storage
    .from('meal-images')
    .getPublicUrl(fileName)
  
  // Call Cloud Vision API
  const response = await fetch(CLOUD_VISION_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CLOUD_VISION_API_KEY}`
    },
    body: JSON.stringify({
      image: {
        source: {
          imageUri: publicUrl
        }
      },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'OBJECT_LOCALIZATION' },
        { type: 'TEXT_DETECTION' }
      ]
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze image')
  }
  
  const result = await response.json()
  
  // Clean up the temporary image
  await supabase.storage
    .from('meal-images')
    .remove([fileName])
  
  return result
}

function findMatchingFoodItem(item: string): string | null {
  const normalizedItem = item.toLowerCase().trim()
  
  // Direct match
  if (normalizedItem in FOOD_DATABASE) {
    return normalizedItem
  }
  
  // Partial match
  for (const foodItem of Object.keys(FOOD_DATABASE)) {
    if (normalizedItem.includes(foodItem) || foodItem.includes(normalizedItem)) {
      return foodItem
    }
  }
  
  return null
}

export function extractFoodItems(analysisResult: VisionAnalysisResult): Array<{name: string, confidence: number}> {
  const foodItems = new Map<string, number>()
  
  // Extract from labels
  analysisResult.labels
    .filter(label => label.confidence > 0.5)
    .forEach(label => {
      const matchingFood = findMatchingFoodItem(label.name)
      if (matchingFood) {
        foodItems.set(matchingFood, Math.max(foodItems.get(matchingFood) || 0, label.confidence))
      }
    })
  
  // Extract from objects
  analysisResult.objects
    .filter(obj => obj.confidence > 0.5)
    .forEach(obj => {
      const matchingFood = findMatchingFoodItem(obj.name)
      if (matchingFood) {
        foodItems.set(matchingFood, Math.max(foodItems.get(matchingFood) || 0, obj.confidence))
      }
    })
  
  // Extract from text (looking for food-related terms)
  const foodKeywords = ['calories', 'protein', 'carbs', 'fat', 'serving', 'portion', 'g', 'gram', 'oz', 'ounce']
  analysisResult.text
    .filter(text => text.confidence > 0.5)
    .forEach(text => {
      const words = text.text.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (foodKeywords.some(keyword => word.includes(keyword))) {
          const matchingFood = findMatchingFoodItem(word)
          if (matchingFood) {
            foodItems.set(matchingFood, Math.max(foodItems.get(matchingFood) || 0, text.confidence))
          }
        }
      })
    })
  
  return Array.from(foodItems.entries()).map(([name, confidence]) => ({ name, confidence }))
}

// Enhanced portion size estimation with visual cues
function estimatePortionSize(foodItem: string, confidence: number, imageAnalysis: VisionAnalysisResult): number {
  const defaultPortions: Record<string, number> = {
    'chicken breast': 150,
    'chicken': 150,
    'beef': 150,
    'fish': 150,
    'salmon': 150,
    'tofu': 100,
    'eggs': 50,
    'rice': 100,
    'pasta': 100,
    'bread': 50,
    'potato': 150,
    'sweet potato': 150,
    'salad': 100,
    'broccoli': 100,
    'carrots': 100,
    'spinach': 100,
    'apple': 150,
    'banana': 120,
    'orange': 150,
    'milk': 250,
    'yogurt': 150,
    'cheese': 50,
  }
  
  // Get base portion
  const basePortion = defaultPortions[foodItem] || 100
  
  // Adjust based on confidence
  let portionMultiplier = 0.5 + confidence * 0.5
  
  // Adjust based on visual cues from the image
  const visualCues = imageAnalysis.objects
    .filter(obj => obj.confidence > 0.5)
    .map(obj => ({
      size: obj.boundingBox.width * obj.boundingBox.height,
      confidence: obj.confidence
    }))
  
  if (visualCues.length > 0) {
    const avgSize = visualCues.reduce((sum, cue) => sum + cue.size, 0) / visualCues.length
    const sizeMultiplier = Math.min(Math.max(avgSize * 2, 0.5), 1.5)
    portionMultiplier *= sizeMultiplier
  }
  
  return Math.round(basePortion * portionMultiplier)
}

// Enhanced nutrition analysis
export function analyzeNutritionalValue(nutrition: {
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
  potassium: number
  vitamins: Record<string, number>
  minerals: Record<string, number>
}): {
  score: number
  insights: string[]
  recommendations: string[]
} {
  const insights: string[] = []
  const recommendations: string[] = []
  let score = 100

  // Calorie analysis
  if (nutrition.calories > 800) {
    insights.push('High calorie meal')
    recommendations.push('Consider reducing portion size')
    score -= 10
  }

  // Protein analysis
  const proteinPercentage = (nutrition.proteins * 4) / nutrition.calories * 100
  if (proteinPercentage < 15) {
    insights.push('Low protein content')
    recommendations.push('Add a protein source to your meal')
    score -= 5
  } else if (proteinPercentage > 40) {
    insights.push('Very high protein content')
    recommendations.push('Consider adding more carbohydrates for balance')
    score -= 5
  }

  // Carb analysis
  const carbPercentage = (nutrition.carbs * 4) / nutrition.calories * 100
  if (carbPercentage < 20) {
    insights.push('Low carbohydrate content')
    recommendations.push('Add complex carbohydrates for energy')
    score -= 5
  } else if (carbPercentage > 60) {
    insights.push('High carbohydrate content')
    recommendations.push('Consider reducing carb portion')
    score -= 5
  }

  // Fat analysis
  const fatPercentage = (nutrition.fats * 9) / nutrition.calories * 100
  if (fatPercentage > 35) {
    insights.push('High fat content')
    recommendations.push('Consider choosing leaner options')
    score -= 10
  }

  // Fiber analysis
  if (nutrition.fiber < 5) {
    insights.push('Low fiber content')
    recommendations.push('Add more vegetables or whole grains')
    score -= 5
  }

  // Sugar analysis
  if (nutrition.sugar > 20) {
    insights.push('High sugar content')
    recommendations.push('Consider reducing added sugars')
    score -= 10
  }

  // Sodium analysis
  if (nutrition.sodium > 1000) {
    insights.push('High sodium content')
    recommendations.push('Consider reducing salt intake')
    score -= 10
  }

  // Vitamin and mineral analysis
  const lowNutrients = []
  if (nutrition.vitamins.A < 10) lowNutrients.push('Vitamin A')
  if (nutrition.vitamins.C < 10) lowNutrients.push('Vitamin C')
  if (nutrition.vitamins.D < 10) lowNutrients.push('Vitamin D')
  if (nutrition.minerals.calcium < 100) lowNutrients.push('Calcium')
  if (nutrition.minerals.iron < 2) lowNutrients.push('Iron')

  if (lowNutrients.length > 0) {
    insights.push(`Low in: ${lowNutrients.join(', ')}`)
    recommendations.push('Consider adding foods rich in these nutrients')
    score -= 5
  }

  return {
    score: Math.max(0, score),
    insights,
    recommendations
  }
}

export function estimateNutritionFromImage(analysisResult: VisionAnalysisResult): {
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
  potassium: number
  vitamins: Record<string, number>
  minerals: Record<string, number>
  detectedItems: Array<{
    name: string
    portion: number
    nutrition: {
      calories: number
      proteins: number
      carbs: number
      fats: number
      fiber: number
      sugar: number
      sodium: number
      potassium: number
      vitamins: Record<string, number>
      minerals: Record<string, number>
    }
  }>
  analysis: {
    score: number
    insights: string[]
    recommendations: string[]
  }
} {
  const foodItems = extractFoodItems(analysisResult)
  let totalNutrition = {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    potassium: 0,
    vitamins: { A: 0, C: 0, D: 0, E: 0, K: 0 },
    minerals: { calcium: 0, iron: 0, magnesium: 0, zinc: 0 }
  }
  
  const detectedItems = foodItems.map(({ name, confidence }) => {
    const portion = estimatePortionSize(name, confidence, analysisResult)
    const nutrition = FOOD_DATABASE[name as keyof typeof FOOD_DATABASE]
    
    const itemNutrition = {
      calories: Math.round((nutrition.calories * portion) / 100),
      proteins: Math.round((nutrition.proteins * portion) / 100),
      carbs: Math.round((nutrition.carbs * portion) / 100),
      fats: Math.round((nutrition.fats * portion) / 100),
      fiber: Math.round((nutrition.fiber * portion) / 100),
      sugar: Math.round((nutrition.sugar * portion) / 100),
      sodium: Math.round((nutrition.sodium * portion) / 100),
      potassium: Math.round((nutrition.potassium * portion) / 100),
      vitamins: {
        A: Math.round((nutrition.vitamins.A * portion) / 100),
        C: Math.round((nutrition.vitamins.C * portion) / 100),
        D: Math.round((nutrition.vitamins.D * portion) / 100),
        E: Math.round((nutrition.vitamins.E * portion) / 100),
        K: Math.round((nutrition.vitamins.K * portion) / 100)
      },
      minerals: {
        calcium: Math.round((nutrition.minerals.calcium * portion) / 100),
        iron: Math.round((nutrition.minerals.iron * portion) / 100),
        magnesium: Math.round((nutrition.minerals.magnesium * portion) / 100),
        zinc: Math.round((nutrition.minerals.zinc * portion) / 100)
      }
    }
    
    // Add to totals
    totalNutrition.calories += itemNutrition.calories
    totalNutrition.proteins += itemNutrition.proteins
    totalNutrition.carbs += itemNutrition.carbs
    totalNutrition.fats += itemNutrition.fats
    totalNutrition.fiber += itemNutrition.fiber
    totalNutrition.sugar += itemNutrition.sugar
    totalNutrition.sodium += itemNutrition.sodium
    totalNutrition.potassium += itemNutrition.potassium
    Object.keys(itemNutrition.vitamins).forEach(vitamin => {
      totalNutrition.vitamins[vitamin as keyof typeof totalNutrition.vitamins] += 
        itemNutrition.vitamins[vitamin as keyof typeof itemNutrition.vitamins]
    })
    Object.keys(itemNutrition.minerals).forEach(mineral => {
      totalNutrition.minerals[mineral as keyof typeof totalNutrition.minerals] += 
        itemNutrition.minerals[mineral as keyof typeof itemNutrition.minerals]
    })
    
    return {
      name,
      portion,
      nutrition: itemNutrition
    }
  })
  
  return {
    ...totalNutrition,
    detectedItems,
    analysis: analyzeNutritionalValue(totalNutrition)
  }
} 