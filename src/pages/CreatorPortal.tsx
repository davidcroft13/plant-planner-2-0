import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import RecipeManagement from '../components/RecipeManagement'
import WorkoutManagement from '../components/WorkoutManagement'
import CourseManagement from '../components/CourseManagement'
import PostManagement from '../components/PostManagement'
import SettingsManagement from '../components/SettingsManagement'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface ContentStats {
  recipes: { total: number; published: number; draft: number }
  workouts: { total: number; published: number; draft: number }
  courses: { total: number; published: number; draft: number }
  posts: { total: number; published: number; draft: number }
}

const CreatorPortal: React.FC = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'workouts' | 'courses' | 'posts' | 'settings'>('overview')
  const [stats, setStats] = useState<ContentStats>({
    recipes: { total: 0, published: 0, draft: 0 },
    workouts: { total: 0, published: 0, draft: 0 },
    courses: { total: 0, published: 0, draft: 0 },
    posts: { total: 0, published: 0, draft: 0 }
  })

  // Check if user is admin
  useEffect(() => {
    if (userProfile && userProfile.role !== 'admin') {
      navigate('/')
    }
  }, [userProfile, navigate])

  // Load content stats
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadContentStats()
    }
  }, [userProfile])

  const loadContentStats = async () => {
    try {
      // Fetch recipes stats
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('is_published')
      
      if (recipesError) {
        console.error('Error fetching recipes stats:', recipesError)
      }

      // Fetch workouts stats
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('is_published')
      
      if (workoutsError) {
        console.error('Error fetching workouts stats:', workoutsError)
      }

      // Fetch courses stats
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('is_published')
      
      if (coursesError) {
        console.error('Error fetching courses stats:', coursesError)
      }

      // Fetch posts stats
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('is_published')
      
      if (postsError) {
        console.error('Error fetching posts stats:', postsError)
      }

      // Calculate stats
      const calculateStats = (data: any[]) => {
        const total = data.length
        const published = data.filter(item => item.is_published).length
        const draft = total - published
        return { total, published, draft }
      }

      setStats({
        recipes: calculateStats(recipesData || []),
        workouts: calculateStats(workoutsData || []),
        courses: calculateStats(coursesData || []),
        posts: calculateStats(postsData || [])
      })
    } catch (error) {
      console.error('Error loading content stats:', error)
    }
  }

  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the Creator Portal.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'recipes', name: 'Recipes', icon: '🍳' },
    { id: 'workouts', name: 'Workouts', icon: '💪' },
    { id: 'courses', name: 'Courses', icon: '📚' },
    { id: 'posts', name: 'Posts', icon: '📝' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PlantPlanner</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</h3>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Content</h3>
            {tabs.slice(1).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform</h3>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' ? 'Dashboard' : 
                 activeTab === 'recipes' ? 'Recipes' :
                 activeTab === 'workouts' ? 'Workouts' :
                 activeTab === 'courses' ? 'Courses' :
                 activeTab === 'posts' ? 'Posts' :
                 activeTab === 'settings' ? 'Settings' : 'Creator Portal'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {activeTab === 'overview' ? 'Content overview and quick actions' :
                 activeTab === 'recipes' ? 'Manage your recipes' :
                 activeTab === 'workouts' ? 'Manage your workouts' :
                 activeTab === 'courses' ? 'Manage your courses' :
                 activeTab === 'posts' ? 'Manage your posts' :
                 activeTab === 'settings' ? 'Customize your app settings' : 'Manage your content'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {userProfile.name}</span>
                   <button
                     onClick={() => navigate('/app')}
                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                   >
                     View Main Site
                   </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">🍳</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Recipes</h3>
                      <p className="text-2xl font-bold text-blue-600">{stats.recipes.total}</p>
                      <p className="text-sm text-gray-600">{stats.recipes.published} published, {stats.recipes.draft} drafts</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">💪</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Workouts</h3>
                      <p className="text-2xl font-bold text-green-600">{stats.workouts.total}</p>
                      <p className="text-sm text-gray-600">{stats.workouts.published} published, {stats.workouts.draft} drafts</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📚</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
                      <p className="text-2xl font-bold text-purple-600">{stats.courses.total}</p>
                      <p className="text-sm text-gray-600">{stats.courses.published} published, {stats.courses.draft} drafts</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📝</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
                      <p className="text-2xl font-bold text-orange-600">{stats.posts.total}</p>
                      <p className="text-sm text-gray-600">{stats.posts.published} published, {stats.posts.draft} drafts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🍳</div>
                  <h3 className="font-semibold">Create Recipe</h3>
                  <p className="text-sm opacity-90">Add a new recipe</p>
                </button>

                <button
                  onClick={() => setActiveTab('workouts')}
                  className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">💪</div>
                  <h3 className="font-semibold">Create Workout</h3>
                  <p className="text-sm opacity-90">Add a new workout</p>
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold">Create Course</h3>
                  <p className="text-sm opacity-90">Add a new course</p>
                </button>

                <button
                  onClick={() => setActiveTab('posts')}
                  className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold">Create Post</h3>
                  <p className="text-sm opacity-90">Add a new post</p>
                </button>
              </div>
            </div>
          )}

               {activeTab === 'recipes' && <RecipeManagement />}

               {activeTab === 'workouts' && <WorkoutManagement />}

               {activeTab === 'courses' && <CourseManagement />}

          {activeTab === 'posts' && <PostManagement />}

          {activeTab === 'settings' && <SettingsManagement />}
        </div>
      </div>
    </div>
  )
}

export default CreatorPortal
