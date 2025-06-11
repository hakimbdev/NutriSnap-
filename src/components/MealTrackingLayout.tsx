import React, { useState, useEffect } from 'react'
import { getMealsByDate } from '@/lib/db'
import { MealCapture } from './MealCapture'
import { motion, AnimatePresence } from 'framer-motion'

interface MealTrackingLayoutProps {
  userId: string
}

export const MealTrackingLayout: React.FC<MealTrackingLayoutProps> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [meals, setMeals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today')

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
    loadMeals(newDate)
  }

  const loadMeals = async (date: Date) => {
    setIsLoading(true)
    try {
      const dateStr = date.toISOString().split('T')[0]
      const mealsData = await getMealsByDate(userId, dateStr)
      setMeals(mealsData)
    } catch (error) {
      console.error('Error loading meals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMeals(selectedDate)
  }, [selectedDate])

  const calculateDailyTotals = () => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      proteins: totals.proteins + meal.proteins,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 })
  }

  const handleMealAdded = () => {
    loadMeals(selectedDate)
  }

  const totals = calculateDailyTotals()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{formatDate(selectedDate)}</h1>
            <button
              onClick={() => handleDateChange(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              History
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Daily Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-sm text-gray-500">Calories</div>
                  <div className="text-2xl font-bold text-blue-600">{totals.calories}</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-sm text-gray-500">Proteins</div>
                  <div className="text-2xl font-bold text-green-600">{totals.proteins}g</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-sm text-gray-500">Carbs</div>
                  <div className="text-2xl font-bold text-yellow-600">{totals.carbs}g</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-sm text-gray-500">Fats</div>
                  <div className="text-2xl font-bold text-red-600">{totals.fats}g</div>
                </motion.div>
              </motion.div>

              {/* Meals List */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm"
              >
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : meals.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center"
                  >
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-6xl mb-4"
                    >
                      🍽️
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('history')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add your first meal
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="divide-y">
                    {meals.map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                        className="flex items-start space-x-4 p-4 transition-colors"
                      >
                        {meal.image_url && (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={meal.image_url}
                            alt={meal.food_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{meal.food_name}</h4>
                            <span className="text-sm text-gray-500 capitalize">{meal.meal_type}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">{meal.calories}</span> kcal
                            </div>
                            <div>
                              <span className="font-medium">{meal.proteins}g</span> protein
                            </div>
                            <div>
                              <span className="font-medium">{meal.carbs}g</span> carbs
                            </div>
                            <div>
                              <span className="font-medium">{meal.fats}g</span> fat
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Add Meal Button */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-6 right-6"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTab('history')}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <MealCapture userId={userId} onMealAdded={handleMealAdded} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
} 