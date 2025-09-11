import React, { useState } from 'react'
import { Search, Filter, Plus, MoreVertical, Heart } from 'lucide-react'

const RecipesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app this would come from Supabase
  const recipes = [
    {
      id: 1,
      title: 'Banana Pudding',
      image: '/api/placeholder/300/200',
      category: 'Dessert',
      time: '15 min',
      calories: '1820 cal'
    },
    {
      id: 2,
      title: 'Butternut Squash Soup',
      image: '/api/placeholder/300/200',
      category: 'Dinner',
      time: '60 min',
      calories: 'cal'
    },
    {
      id: 3,
      title: 'Sweet Potato Mash',
      image: '/api/placeholder/300/200',
      category: 'Dinner',
      time: '30 min',
      calories: '43 cal'
    },
    {
      id: 4,
      title: 'Creamy Butternut Squash S...',
      image: '/api/placeholder/300/200',
      time: '60 min',
      calories: '250 cal'
    },
    {
      id: 5,
      title: 'Roasted Brussels Sprouts with Tempeh...',
      image: '/api/placeholder/300/200',
      time: '35 min',
      calories: '320 cal'
    },
    {
      id: 6,
      title: 'Autumn Lentil Salad with Roasted Vegetables',
      image: '/api/placeholder/300/200',
      time: '40 min',
      calories: '500 cal'
    },
    {
      id: 7,
      title: 'Tahini Chocolate Chip Cookies',
      image: '/api/placeholder/300/200',
      time: '30 min',
      calories: '250 cal'
    },
    {
      id: 8,
      title: 'Vegan T...',
      image: '/api/placeholder/300/200',
      time: '25 min',
      calories: '180 cal'
    },
    {
      id: 9,
      title: 'Loaded Panzanella Salad',
      image: '/api/placeholder/300/200',
      time: '5 min',
      calories: '250 cal'
    }
  ]

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
      <p className="text-gray-600 mb-6">{recipes.length} recipes</p>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card card-hover overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {recipe.category && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    {recipe.category}
                  </span>
                )}
                <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                  {recipe.time}
                </span>
                <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                  {recipe.calories}
                </span>
              </div>
              <button className="absolute top-3 right-3 p-1">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{recipe.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipesPage
