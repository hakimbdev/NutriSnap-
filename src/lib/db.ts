import { supabase } from './supabase'
import type { Meal, UserProfile } from './supabase'
import { analyzeMealImage, estimateNutritionFromImage } from './vision'

// Meal operations
export async function addMeal(meal: Omit<Meal, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('meals')
    .insert([meal])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function getMeals(userId: string) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getMealsByDate(userId: string, date: string) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)
  
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// User profile operations
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Storage operations
export async function uploadMealImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('meal-images')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('meal-images')
    .getPublicUrl(fileName)
  
  return publicUrl
}

// Enhanced meal operations with vision analysis
export async function addMealWithVision(imageFile: File, userId: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') {
  try {
    // Analyze the image using Cloud Vision API
    const analysisResult = await analyzeMealImage(imageFile)
    
    // Extract food items and estimate nutrition
    const nutrition = estimateNutritionFromImage(analysisResult)
    
    // Upload the image to Supabase storage
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meal-images')
      .upload(fileName, imageFile)
    
    if (uploadError) throw uploadError
    
    const { data: { publicUrl } } = supabase.storage
      .from('meal-images')
      .getPublicUrl(fileName)
    
    // Create the meal record
    const { data: mealData, error: mealError } = await supabase
      .from('meals')
      .insert([{
        user_id: userId,
        image_url: publicUrl,
        food_name: analysisResult.labels[0]?.name || 'Unknown Food',
        calories: nutrition.calories,
        proteins: nutrition.proteins,
        carbs: nutrition.carbs,
        fats: nutrition.fats,
        meal_type: mealType
      }])
      .select()
    
    if (mealError) throw mealError
    
    return {
      meal: mealData[0],
      analysis: {
        detectedItems: analysisResult.labels.map(label => label.name),
        confidence: analysisResult.labels[0]?.confidence || 0
      }
    }
  } catch (error) {
    console.error('Error adding meal with vision:', error)
    throw error
  }
} 