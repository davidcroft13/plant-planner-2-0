import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Calendar, Star, Heart, X } from 'lucide-react'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface Recipe {
  id: string
  title: string
  description: string
  image_url?: string
  prep_time?: number
  cook_time?: number
  servings?: number
  category: string
  ingredients?: string[]
  instructions?: string[]
}

interface MealPlan {
  id: string
  title: string
  description: string
  image_url?: string
  duration_days: number
  difficulty: string
  category?: string
  is_featured: boolean
  is_published: boolean
  created_at: string
}

interface MealPlanRecipe {
  id: string
  meal_plan_id: string
  recipe_id: string
  day_number: number
  meal_type: string
  servings: number
  recipe?: Recipe
}

const MealPlanPage: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [mealPlanRecipes, setMealPlanRecipes] = useState<MealPlanRecipe[]>([])
  const [filter, setFilter] = useState<'all' | 'featured' | 'my_plans'>('all')

  useEffect(() => {
    fetchMealPlans()
  }, [])

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching meal plans:', error)
      } else {
        setMealPlans(data || [])
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error)
    } finally {
      setLoading(false)
    }
  }


  const fetchMealPlanRecipes = async (mealPlanId: string) => {
    try {
      const { data, error } = await supabase
        .from('meal_plan_recipes')
        .select(`
          *,
          recipe:recipes(*)
        `)
        .eq('meal_plan_id', mealPlanId)
        .order('day_number', { ascending: true })

      if (error) {
        console.error('Error fetching meal plan recipes:', error)
      } else {
        setMealPlanRecipes(data || [])
      }
    } catch (error) {
      console.error('Error fetching meal plan recipes:', error)
    }
  }

  const handleViewMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan)
    fetchMealPlanRecipes(mealPlan.id)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredMealPlans = mealPlans.filter(plan => {
    if (filter === 'featured') return plan.is_featured
    if (filter === 'my_plans') return false // TODO: Add user-specific meal plans
    return true
  })


  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meal Plans</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Plans
        </button>
        <button
          onClick={() => setFilter('featured')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'featured' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Star className="w-4 h-4 inline mr-1" />
          Featured
        </button>
        <button
          onClick={() => setFilter('my_plans')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'my_plans' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          My Plans
        </button>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-600">Loading meal plans...</div>
        ) : filteredMealPlans.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No meal plans yet</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'featured' ? 'No featured meal plans available' : 
               filter === 'my_plans' ? 'You haven\'t created any meal plans yet' :
               'No meal plans available yet'}
            </p>
            {filter !== 'my_plans' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Plan
              </button>
            )}
          </div>
        ) : (
          filteredMealPlans.map((mealPlan) => (
            <div key={mealPlan.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <img 
                  src={mealPlan.image_url || 'https://via.placeholder.com/400x200'} 
                  alt={mealPlan.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  {mealPlan.is_featured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  )}
                  <button className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 shadow-md">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(mealPlan.difficulty)}`}>
                    {mealPlan.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{mealPlan.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mealPlan.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {mealPlan.duration_days} days
                    </span>
                    {mealPlan.category && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {mealPlan.category}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewMealPlan(mealPlan)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Plan
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Meal Plan Detail Modal */}
      {selectedMealPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMealPlan.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedMealPlan.description}</p>
                </div>
                <button
                  onClick={() => setSelectedMealPlan(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {Array.from({ length: selectedMealPlan.duration_days }, (_, i) => i + 1).map((day) => {
                  const dayRecipes = mealPlanRecipes.filter(recipe => recipe.day_number === day)
                  return (
                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 text-center">Day {day}</h3>
                      <div className="space-y-3">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                          const mealRecipe = dayRecipes.find(recipe => recipe.meal_type === mealType)
                          return (
                            <div key={mealType} className="text-sm">
                              <div className="font-medium text-gray-700 capitalize mb-1">{mealType}</div>
                              {mealRecipe?.recipe ? (
                                <div className="bg-white rounded p-2">
                                  <div className="font-medium text-gray-900 line-clamp-2">
                                    {mealRecipe.recipe.title}
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {mealRecipe.servings} serving{mealRecipe.servings !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs italic">No {mealType}</div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setSelectedMealPlan(null)}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Meal Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create Meal Plan</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
                <p className="text-gray-600 mb-4">
                  The meal plan creation tool is currently under development. 
                  You'll be able to create custom meal plans using your favorite recipes soon!
                </p>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlanPage