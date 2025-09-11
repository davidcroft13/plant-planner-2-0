import React, { useState } from 'react'
import { Plus, MoreVertical, Calendar, Clock } from 'lucide-react'

const MealPlanPage: React.FC = () => {
  const [showNewPlan, setShowNewPlan] = useState(false)

  // Mock data - in real app this would come from Supabase
  const featuredPlans = [
    {
      id: 1,
      title: 'Featured Meal Plan 1',
      type: 'Smart Plan',
      createdAt: '6/04/25 11:09 am',
      recipes: ['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5'],
      additionalCount: 20
    }
  ]

  const userPlans = [
    {
      id: 1,
      title: 'Featured Meal Plan 1',
      type: 'Smart Plan',
      createdAt: '6/04/25 11:09 am',
      recipes: ['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5'],
      additionalCount: 20
    },
    {
      id: 2,
      title: 'featured plan 2',
      type: 'Smart Plan',
      createdAt: '6/04/25 11:14 am',
      recipes: ['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5'],
      additionalCount: 22
    },
    {
      id: 3,
      title: 'No Lentils',
      type: 'Smart Plan',
      createdAt: '5/16/25 10:28 am',
      recipes: ['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5'],
      additionalCount: 20
    },
    {
      id: 4,
      title: 'test agqain',
      type: 'Smart Plan',
      createdAt: '3/21/25 2:31 pm',
      recipes: ['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5'],
      additionalCount: 20
    },
    {
      id: 5,
      title: 'another',
      type: 'Smart Plan',
      createdAt: '3/20/25 1:15 pm',
      recipes: ['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5'],
      additionalCount: 20
    }
  ]

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Meal Plans</h1>
        <button 
          onClick={() => setShowNewPlan(true)}
          className="btn btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New plan
        </button>
      </div>

      {/* Featured Meal Plans */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Meal Plans</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            See all...
          </button>
        </div>
        
        <div className="space-y-4">
          {featuredPlans.map((plan) => (
            <div key={plan.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {plan.type}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {plan.createdAt}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {plan.recipes.map((_, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"
                      />
                    ))}
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{plan.additionalCount}</span>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary px-4 py-2">
                    Open plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Meal Plans */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your meal plans</h2>
        
        <div className="space-y-4">
          {userPlans.map((plan) => (
            <div key={plan.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {plan.type}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {plan.createdAt}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {plan.recipes.map((_, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"
                      />
                    ))}
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{plan.additionalCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-primary px-4 py-2">
                      Open plan
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MealPlanPage
