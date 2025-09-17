import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, MoreVertical, Heart, Clock, Users, Play } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface Workout {
  id: string
  title: string
  description: string
  image_url?: string
  video_url?: string
  category: string
  duration: number
  difficulty: string
  exercises?: Exercise[]
  is_published: boolean
  created_at: string
}

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: number
  rest?: number
  notes?: string
  image_url?: string
  video_url?: string
}

const WorkoutsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)

  useEffect(() => {
    fetchPublishedWorkouts()
  }, [])

  const fetchPublishedWorkouts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching workouts:', error)
      } else {
        setWorkouts(data || [])
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkouts = workouts.filter(workout =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading workouts...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
          <p className="text-gray-600">Discover amazing workouts to keep you fit and healthy</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Workouts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No workouts found</div>
              <p className="text-gray-400 mt-2">
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new workouts'}
              </p>
            </div>
          ) : (
            filteredWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedWorkout(workout)}
              >
                <div className="relative">
                  <img 
                    src={workout.image_url || 'https://via.placeholder.com/400x250'} 
                    alt={workout.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {workout.category && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {workout.category}
                      </span>
                    )}
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {workout.duration || 0} min
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-1">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  {workout.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{workout.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{workout.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Workout Detail Modal */}
        {selectedWorkout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedWorkout.image_url || 'https://via.placeholder.com/800x400'} 
                  alt={selectedWorkout.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="absolute top-4 left-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                {selectedWorkout.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedWorkout.title}</h2>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedWorkout.duration || 0} min
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(selectedWorkout.difficulty)}`}>
                    {selectedWorkout.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                    {selectedWorkout.category}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedWorkout.description}</p>
                </div>

                {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercises</h3>
                    <div className="space-y-4">
                      {selectedWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                            <div className="flex space-x-2 text-sm text-gray-600">
                              {exercise.sets && <span>{exercise.sets} sets</span>}
                              {exercise.reps && <span>{exercise.reps} reps</span>}
                              {exercise.duration && <span>{exercise.duration}s</span>}
                            </div>
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-gray-600">{exercise.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedWorkout(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Start Workout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutsPage