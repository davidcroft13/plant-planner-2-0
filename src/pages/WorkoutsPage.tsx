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
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
              <div className="relative">
                <img 
                  src={selectedWorkout.image_url || 'https://via.placeholder.com/800x500'} 
                  alt={selectedWorkout.title}
                  className="w-full h-80 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedWorkout(null)}
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
                {selectedWorkout.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedWorkout.title}</h2>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedWorkout.duration || 0} min
                    </span>
                    <span className={`px-4 py-2 rounded-full font-medium ${getDifficultyColor(selectedWorkout.difficulty)}`}>
                      {selectedWorkout.difficulty}
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                      {selectedWorkout.category}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedWorkout.description}</p>
                </div>

                {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Exercises</h3>
                    <div className="space-y-6">
                      {selectedWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">{exercise.name}</h4>
                            <div className="flex space-x-3 text-sm text-gray-600">
                              {exercise.sets && <span className="bg-white px-3 py-1 rounded-full">{exercise.sets} sets</span>}
                              {exercise.reps && <span className="bg-white px-3 py-1 rounded-full">{exercise.reps} reps</span>}
                              {exercise.duration && <span className="bg-white px-3 py-1 rounded-full">{exercise.duration}s</span>}
                            </div>
                          </div>
                          {exercise.notes && (
                            <p className="text-gray-600 mb-4">{exercise.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedWorkout(null)}
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
    </div>
  )
}

export default WorkoutsPage