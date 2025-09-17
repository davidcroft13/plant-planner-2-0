import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Heart, MoreVertical, Users } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface Recipe {
  id: string
  title: string
  description: string
  image_url?: string
  category: string
  prep_time: number
  cook_time: number
  servings: number
  is_published: boolean
  created_at: string
}

interface Workout {
  id: string
  title: string
  description: string
  image_url?: string
  category: string
  duration: number
  difficulty: string
  is_published: boolean
  created_at: string
}

interface Post {
  id: string
  title: string
  description: string
  image_url?: string
  category: string
  is_published: boolean
  created_at: string
}

const HomePage: React.FC = () => {
  const [newestRecipes, setNewestRecipes] = useState<Recipe[]>([])
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPublishedContent()
  }, [])

  const fetchPublishedContent = async () => {
    try {
      setLoading(true)
      
      // Fetch recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError)
      } else {
        setNewestRecipes(recipes || [])
      }

      // Fetch workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError)
      } else {
        setRecentWorkouts(workouts || [])
      }

      // Fetch posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (postsError) {
        console.error('Error fetching posts:', postsError)
      } else {
        setRecentPosts(posts || [])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for other sections

  const ourFavorites = [
    {
      id: 1,
      title: 'Roasted Vegetables',
      image: '/api/placeholder/200/150',
      category: 'Dinner',
      time: '45 min',
      calories: '320 cal'
    }
  ]

  return (
    <div className="px-4 py-6">
      {/* Recent Posts Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-600">Loading posts...</div>
          ) : recentPosts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">No published posts yet</div>
          ) : (
            recentPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative">
                  <img 
                    src={post.image_url || 'https://via.placeholder.com/300x200'} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {post.category && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Newest Recipes Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Newest Recipes</h2>
          <Link to="/app/recipes" className="text-primary-600 hover:text-primary-700 font-medium">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-600">Loading recipes...</div>
          ) : newestRecipes.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">No published recipes yet</div>
          ) : (
            newestRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative">
                  <img 
                    src={recipe.image_url || 'https://via.placeholder.com/300x200'} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {recipe.category && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
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
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Workouts Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent workouts</h2>
          <Link to="/app/workouts" className="text-primary-600 hover:text-primary-700 font-medium">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-600">Loading workouts...</div>
          ) : recentWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">No published workouts yet</div>
          ) : (
            recentWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedWorkout(workout)}
              >
                <div className="relative">
                  <img 
                    src={workout.image_url || 'https://via.placeholder.com/300x200'} 
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
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      {workout.difficulty}
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-1">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{workout.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{workout.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Our Favorites Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Our Favorites</h2>
          <Link to="/app/recipes" className="text-primary-600 hover:text-primary-700 font-medium">
            See All
          </Link>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {ourFavorites.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-48">
              <div className="card card-hover overflow-hidden">
                <div className="relative">
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg"></div>
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      {item.time}
                    </span>
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      {item.calories}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedRecipe.image_url || 'https://via.placeholder.com/800x400'} 
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
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
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRecipe.title}</h2>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {(selectedRecipe.prep_time || 0) + (selectedRecipe.cook_time || 0)} min
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {selectedRecipe.servings} servings
                </span>
                <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                  {selectedRecipe.category}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedRecipe.description}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Save Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedWorkout.title}</h2>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedWorkout.duration || 0} min
                </span>
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">
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

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedPost.image_url || 'https://via.placeholder.com/800x400'} 
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 left-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPost.title}</h2>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                  {selectedPost.category}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedPost.description}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
