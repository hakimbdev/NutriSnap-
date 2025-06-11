import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Meal = {
  id: string
  created_at: string
  user_id: string
  image_url: string
  food_name: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export type UserProfile = {
  id: string
  created_at: string
  user_id: string
  name: string
  email: string
  daily_calorie_goal: number
  daily_protein_goal: number
  daily_carbs_goal: number
  daily_fats_goal: number
} 