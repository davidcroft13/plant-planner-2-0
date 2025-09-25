import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, MoreVertical, Heart, Clock, Users } from 'lucide-react'
import supabase from '../utils/supabase'

interface Recipe {
  id: string
  title: string
  description: string
  image_url?: string
  category: string
  prep_time: number
  cook_time: number
  servings: number
  ingredients?: string[]
  instructions?: string[]
  is_published: boolean
  created_at: string
}

const RecipesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetchPublishedRecipes()
  }, [])

  const fetchPublishedRecipes = async () => {
    try {
      console.log('🔄 Fetching published recipes...')
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching recipes:', error)
      } else {
        console.log('✅ Recipes fetched successfully:', data?.length || 0, 'recipes')
        setRecipes(data || [])
      }
    } catch (error) {
      console.error('❌ Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Recipes</h1>
        <button className="btn btn-primary px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          New Recipe
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="btn btn-secondary px-4 py-3">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Recipe Count */}
      <p className="text-gray-600 mb-6">{loading ? 'Loading...' : `${recipes.length} recipes`}</p>

      {/* Recipe Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading recipes...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="card card-hover overflow-hidden cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative">
                <img 
                  src={recipe.image_url || 'https://via.placeholder.com/300x200'} 
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {recipe.category && (
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      {recipe.category}
                    </span>
                  )}
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                  </span>
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {recipe.servings || 0} servings
                  </span>
                </div>
                <button className="absolute top-3 right-3 p-1">
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Ingredients:</p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {recipe.ingredients.slice(0, 3).join(', ')}
                      {recipe.ingredients.length > 3 && ` +${recipe.ingredients.length - 3} more`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img 
                src={selectedRecipe.image_url || 'https://via.placeholder.com/800x500'} 
                alt={selectedRecipe.title}
                className="w-full h-80 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 left-6 bg-white bg-opacity-90 text-gray-700 rounded-full p-3 hover:bg-opacity-100 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute top-6 right-6 flex space-x-3">
                <button className="bg-white bg-opacity-90 text-gray-700 rounded-full p-3 hover:bg-opacity-100 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button className="bg-white bg-opacity-90 text-gray-700 rounded-full p-3 hover:bg-opacity-100 shadow-lg">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                    <Clock className="w-4 h-4 mr-2" />
                    {(selectedRecipe.prep_time || 0) + (selectedRecipe.cook_time || 0)} min
                  </span>
                  <span className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                    <Users className="w-4 h-4 mr-2" />
                    {selectedRecipe.servings} servings
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{selectedRecipe.description}</p>
              </div>

              {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Instructions</h3>
                  <div className="space-y-6">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 leading-relaxed">{instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipesPage
