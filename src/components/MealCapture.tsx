import React, { useState } from 'react'
import { addMealWithVision } from '@/lib/db'
import { analyzeMealImage, estimateNutritionFromImage } from '@/lib/vision'
import { motion, AnimatePresence } from 'framer-motion'

interface MealCaptureProps {
  userId: string
  onMealAdded: () => void
}

export const MealCapture: React.FC<MealCaptureProps> = ({ userId, onMealAdded }) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const mealTypes = [
    { id: 'breakfast', icon: '🍳', label: 'Breakfast' },
    { id: 'lunch', icon: '🍱', label: 'Lunch' },
    { id: 'dinner', icon: '🍽️', label: 'Dinner' },
    { id: 'snack', icon: '🥪', label: 'Snack' }
  ]

  const getMealTypeIcon = (type: string) => {
    return mealTypes.find(t => t.id === type)?.icon || '🍽️'
  }

  const handleImageSelect = async (imageData: string) => {
    if (!selectedMealType) {
      setError('Please select a meal type first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setCapturedImage(imageData)

    try {
      // First analyze the image
      const visionResult = await analyzeMealImage(imageData)
      if (!visionResult || !visionResult.detectedItems || visionResult.detectedItems.length === 0) {
        throw new Error('No food items detected in the image')
      }

      // Then estimate nutrition
      const nutritionResult = await estimateNutritionFromImage(visionResult)
      if (!nutritionResult) {
        throw new Error('Failed to estimate nutrition')
      }

      // Save the meal
      const mealData = await addMealWithVision(userId, imageData, selectedMealType, visionResult, nutritionResult)
      setAnalysisResult(mealData)
      onMealAdded()
    } catch (err) {
      console.error('Error processing image:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setIsCapturing(false)
    setError(null)
    setAnalysisResult(null)
    setCapturedImage(null)
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isCapturing ? (
          <motion.div
            key="meal-type"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mealTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMealType(type.id)
                    setIsCapturing(true)
                  }}
                  className={`p-6 rounded-xl text-center transition-colors ${
                    selectedMealType === type.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-4xl mb-2"
                  >
                    {type.icon}
                  </motion.div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {capturedImage ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={capturedImage}
                  alt="Captured meal"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl"
                  >
                    📸
                  </motion.div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </motion.button>
              {!capturedImage && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {/* Implement camera capture */}}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Photo
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-gray-600">Analyzing your meal...</div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </motion.div>
      )}

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
            <span className="text-sm text-gray-500 capitalize">{analysisResult.meal_type}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-50 p-4 rounded-lg"
            >
              <div className="text-sm text-blue-600">Calories</div>
              <div className="text-2xl font-bold text-blue-700">{analysisResult.calories}</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 p-4 rounded-lg"
            >
              <div className="text-sm text-green-600">Proteins</div>
              <div className="text-2xl font-bold text-green-700">{analysisResult.proteins}g</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-yellow-50 p-4 rounded-lg"
            >
              <div className="text-sm text-yellow-600">Carbs</div>
              <div className="text-2xl font-bold text-yellow-700">{analysisResult.carbs}g</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-red-50 p-4 rounded-lg"
            >
              <div className="text-sm text-red-600">Fats</div>
              <div className="text-2xl font-bold text-red-700">{analysisResult.fats}g</div>
            </motion.div>
          </div>

          {analysisResult.insights && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
              <p className="text-gray-600">{analysisResult.insights}</p>
            </motion.div>
          )}

          {analysisResult.recommendations && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 p-4 rounded-lg"
            >
              <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
              <p className="text-blue-700">{analysisResult.recommendations}</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
} 