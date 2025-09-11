import React, { useState } from 'react'
import { Search, Filter, Plus, MoreVertical, Heart, Clock } from 'lucide-react'

const WorkoutsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app this would come from Supabase
  const workouts = [
    {
      id: 1,
      title: '30 Min Full Body Wedding Shred Barre Workout',
      description: 'I recommend repeating...',
      image: '/api/placeholder/300/200',
      duration: '33 mins',
      featured: true,
      overlay: 'Barre SHRED'
    },
    {
      id: 2,
      title: '30 Minute Full Body Pilates Workout for Beginners',
      description: 'I can\'t wait to hear how...',
      image: '/api/placeholder/300/200',
      duration: '30 mins',
      featured: true,
      overlay: '30 MINUTE FULL BODY WORKOUT'
    },
    {
      id: 3,
      title: 'Lower Ab Burn Workout',
      description: 'I recommend repeating...',
      image: '/api/placeholder/300/200',
      duration: '5 mins',
      featured: true,
      overlay: 'LOWER AB BURN'
    },
    {
      id: 4,
      title: '5 Min Standing Toned Arms Workout',
      description: 'I can\'t wait to hear how...',
      image: '/api/placeholder/300/200',
      duration: '6 mins',
      featured: true,
      overlay: '5 MIN ARMS'
    },
    {
      id: 5,
      title: 'Full Body Workout',
      description: 'In this workout, you will piece together multiple...',
      image: '/api/placeholder/300/200',
      duration: '30 mins',
      featured: false
    },
    {
      id: 6,
      title: 'Workout #2',
      description: 'This is our general workout description.',
      image: '/api/placeholder/300/200',
      duration: '30 mins',
      featured: false
    },
    {
      id: 7,
      title: 'Workout #3',
      description: 'This is our new workout - Lets see what you\'ve got!',
      image: '/api/placeholder/300/200',
      duration: '30 mins',
      featured: false
    }
  ]

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore workouts</h1>
        <button className="btn btn-primary px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Create workout
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Type here..."
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

      {/* Workout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="card card-hover overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              {workout.featured && workout.overlay && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-bold mb-1">{workout.overlay}</div>
                  </div>
                </div>
              )}
              <button className="absolute top-3 right-3 p-1">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{workout.title}</h3>
              <p className="text-gray-600 text-xs mb-3">{workout.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {workout.duration}
                </div>
                <button className="p-1 text-gray-400 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutsPage
