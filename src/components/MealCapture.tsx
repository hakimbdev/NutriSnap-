import React, { useState } from 'react'
import { Camera } from './Camera'
import { addMealWithVision } from '@/lib/db'

interface MealCaptureProps {
  userId: string
  onMealAdded: () => void
}

export const MealCapture: React.FC<MealCaptureProps> = ({ userId, onMealAdded }) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')

  const handleCapture = async (imageFile: File, nutritionAnalysis: any) => {
    try {
      setAnalysis(nutritionAnalysis)
      
      // Save the meal to the database
      await addMealWithVision(imageFile, userId, mealType)
      
      // Notify parent component
      onMealAdded()
      
      // Reset state
      setIsCapturing(false)
      setAnalysis(null)
    } catch (error) {
      console.error('Error saving meal:', error)
      setError('Failed to save meal. Please try again.')
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {!isCapturing ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Capture Your Meal</h2>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsCapturing(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Take Photo</h2>
            <button
              onClick={() => setIsCapturing(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <Camera onCapture={handleCapture} onError={handleError} />

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {analysis && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Nutrition Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-xl font-medium">{analysis.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Proteins</p>
                  <p className="text-xl font-medium">{analysis.proteins}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="text-xl font-medium">{analysis.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fats</p>
                  <p className="text-xl font-medium">{analysis.fats}g</p>
                </div>
              </div>

              {analysis.analysis.insights.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Insights</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {analysis.analysis.insights.map((insight: string, index: number) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.analysis.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {analysis.analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 