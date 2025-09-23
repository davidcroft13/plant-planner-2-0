import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, Heart, Users } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '../contexts/AuthContext'

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
  ingredients?: string[]
  instructions?: string[]
  is_published: boolean
  created_at: string
}

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

interface Post {
  id: string
  title: string
  description: string
  content?: string
  image_url?: string
  category: string
  tags?: string[]
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
  const [searchParams] = useSearchParams()
  const { refreshUserData } = useAuth()

  useEffect(() => {
    fetchPublishedContent()
    
    // Check if user just completed payment (redirected from Stripe)
    const paymentSuccess = searchParams.get('payment_success')
    if (paymentSuccess === 'true') {
      // Refresh user data to get updated subscription status
      refreshUserData()
    }
  }, [searchParams, refreshUserData])

  const fetchPublishedContent = async () => {
    try {
      setLoading(true)
      console.log('=== FETCHING PUBLISHED CONTENT ===')
      
      // Test Supabase connection first
      console.log('Testing Supabase connection...')
      const { error: testError } = await supabase
        .from('recipes')
        .select('count')
        .limit(1)
      
      if (testError) {
        console.error('Supabase connection error:', testError)
        return
      }
      console.log('Supabase connection successful')
      
      // Fetch ALL recipes first (not just published) to see what we have
      console.log('Fetching ALL recipes...')
      const { data: allRecipes, error: allRecipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      console.log('All recipes:', allRecipes?.length || 0, allRecipes)
      console.log('All recipes error:', allRecipesError)
      
      // Now fetch published recipes
      console.log('Fetching published recipes...')
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError)
      } else {
        console.log('Published recipes fetched successfully:', recipes?.length || 0, recipes)
        setNewestRecipes(recipes || [])
      }

      // Fetch ALL workouts first
      console.log('Fetching ALL workouts...')
      const { data: allWorkouts, error: allWorkoutsError } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      console.log('All workouts:', allWorkouts?.length || 0, allWorkouts)
      console.log('All workouts error:', allWorkoutsError)

      // Now fetch published workouts
      console.log('Fetching published workouts...')
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError)
      } else {
        console.log('Published workouts fetched successfully:', workouts?.length || 0, workouts)
        setRecentWorkouts(workouts || [])
      }

      // Fetch ALL posts first
      console.log('Fetching ALL posts...')
      const { data: allPosts, error: allPostsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      console.log('All posts:', allPosts?.length || 0, allPosts)
      console.log('All posts error:', allPostsError)

      // Now fetch published posts
      console.log('Fetching published posts...')
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (postsError) {
        console.error('Error fetching posts:', postsError)
      } else {
        console.log('Published posts fetched successfully:', posts?.length || 0, posts)
        setRecentPosts(posts || [])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      console.log('Finished fetching content')
      setLoading(false)
    }
  }

  // Fetch favorite recipes
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetchFavoriteRecipes()
  }, [])

  const fetchFavoriteRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching favorite recipes:', error)
      } else {
        setFavoriteRecipes(data || [])
      }
    } catch (error) {
      console.error('Error fetching favorite recipes:', error)
    }
  }

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
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Newest Recipes</h2>
          <Link to="/app/recipes" className="text-primary-600 hover:text-primary-700 font-medium text-lg">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-600">Loading recipes...</div>
          ) : newestRecipes.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">No published recipes yet</div>
          ) : (
            newestRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative">
                  <img 
                    src={recipe.image_url || 'https://via.placeholder.com/300x200'} 
                    alt={recipe.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white bg-opacity-90 text-gray-700 rounded-full p-2 hover:bg-opacity-100 shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    <button className="bg-white bg-opacity-90 text-gray-700 rounded-full p-2 hover:bg-opacity-100 shadow-md">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-800 text-sm font-medium rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{recipe.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2 text-xs">{recipe.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                    </span>
                    <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      {recipe.servings || 0} servings
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Workouts Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Recent Workouts</h2>
          <Link to="/app/workouts" className="text-primary-600 hover:text-primary-700 font-medium text-lg">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-600">Loading workouts...</div>
          ) : recentWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">No published workouts yet</div>
          ) : (
            recentWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedWorkout(workout)}
              >
                <div className="relative">
                  <img 
                    src={workout.image_url || 'https://via.placeholder.com/300x200'} 
                    alt={workout.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white bg-opacity-90 text-gray-700 rounded-full p-2 hover:bg-opacity-100 shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    <button className="bg-white bg-opacity-90 text-gray-700 rounded-full p-2 hover:bg-opacity-100 shadow-md">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-800 text-sm font-medium rounded-full">
                      {workout.category}
                    </span>
                  </div>
                  {workout.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{workout.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2 text-xs">{workout.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {workout.duration || 0} min
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {workout.difficulty}
                    </span>
                  </div>
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
          {favoriteRecipes.length === 0 ? (
            <div className="text-center py-8 text-gray-600 w-full">
              No favorite recipes yet. Check back soon!
            </div>
          ) : (
            favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-48">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                     onClick={() => setSelectedRecipe(recipe)}>
                  <div className="relative">
                    <img 
                      src={recipe.image_url || 'https://via.placeholder.com/200x150'} 
                      alt={recipe.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                        {recipe.category}
                      </span>
                      <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                        {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                      </span>
                      <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                        {recipe.servings || 0} servings
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{recipe.title}</h3>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

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
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
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
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium">
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
                        {(exercise.image_url || exercise.video_url) && (
                          <div className="flex space-x-4">
                            {exercise.image_url && (
                              <img 
                                src={exercise.image_url} 
                                alt={exercise.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            {exercise.video_url && (
                              <video 
                                src={exercise.video_url}
                                className="w-24 h-24 object-cover rounded-lg"
                                controls
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedWorkout.video_url && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Workout Video</h3>
                  <video 
                    src={selectedWorkout.video_url}
                    className="w-full h-80 object-cover rounded-xl"
                    controls
                  />
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

              {selectedPost.content && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</div>
                </div>
              )}

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
