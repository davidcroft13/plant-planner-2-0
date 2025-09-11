import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clock, Heart, MoreVertical, ChevronRight } from 'lucide-react'

const HomePage: React.FC = () => {
  // Mock data - in real app this would come from Supabase
  const recentPosts = [
    {
      id: 1,
      title: 'Fun Posts',
      image: '/api/placeholder/300/200',
      type: 'post'
    }
  ]

  const newestRecipes = [
    {
      id: 1,
      title: 'Sweet Potato Mash',
      image: '/api/placeholder/200/150',
      category: 'Dinner',
      time: '30 min',
      calories: '43 cal'
    },
    {
      id: 2,
      title: 'Butternut Squash Soup',
      image: '/api/placeholder/200/150',
      category: 'Dinner',
      time: '60 min',
      calories: 'cal'
    },
    {
      id: 3,
      title: 'Banana Pudding',
      image: '/api/placeholder/200/150',
      category: 'Dessert',
      time: '15 min',
      calories: '1820 cal'
    },
    {
      id: 4,
      title: 'Creamy Butternut Squash S...',
      image: '/api/placeholder/200/150',
      time: '60 min',
      calories: '250 cal'
    }
  ]

  const recentWorkouts = [
    {
      id: 1,
      title: '30 Min Full Body Wedding Shred Barre Workout',
      image: '/api/placeholder/200/150',
      duration: '33 mins',
      featured: true
    },
    {
      id: 2,
      title: '30 Minute Full Body Pilates Workout for Beginners',
      image: '/api/placeholder/200/150',
      duration: '30 mins',
      featured: true
    },
    {
      id: 3,
      title: 'Lower Ab Burn Workout',
      image: '/api/placeholder/200/150',
      duration: '5 mins',
      featured: true
    }
  ]

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
      {/* Recent Post Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Post</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="card card-hover p-6">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
            </div>
          ))}
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
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {newestRecipes.map((recipe) => (
            <div key={recipe.id} className="flex-shrink-0 w-48">
              <div className="card card-hover overflow-hidden">
                <div className="relative">
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg"></div>
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
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
                  <button className="absolute top-2 right-2 p-1">
                    <MoreVertical className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{recipe.title}</h3>
                </div>
              </div>
            </div>
          ))}
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
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="flex-shrink-0 w-48">
              <div className="card card-hover overflow-hidden">
                <div className="relative">
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-lg font-bold mb-1">
                        {workout.featured ? 'BARRE SHRED' : 'WORKOUT'}
                      </div>
                    </div>
                  </div>
                  <button className="absolute top-2 right-2 p-1">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{workout.title}</h3>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {workout.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  )
}

export default HomePage
