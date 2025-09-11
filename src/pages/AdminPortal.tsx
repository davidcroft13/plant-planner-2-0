import React, { useState } from 'react'
import { 
  Home, 
  BarChart3, 
  ChefHat, 
  Calendar, 
  Activity, 
  BookOpen, 
  FileText, 
  Users, 
  CreditCard, 
  Key, 
  Settings, 
  Palette,
  DollarSign,
  CheckCircle,
  Plus,
  ExternalLink
} from 'lucide-react'

const AdminPortal: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard')

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'newsfeed', label: 'Newsfeed', icon: BarChart3 },
    { 
      id: 'content', 
      label: 'Content', 
      icon: FileText,
      children: [
        { id: 'recipes', label: 'Recipes', icon: ChefHat },
        { id: 'meal-plans', label: 'Meal Plans', icon: Calendar },
        { id: 'workouts', label: 'Workouts', icon: Activity },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'articles', label: 'Articles', icon: FileText },
        { id: 'quick-links', label: 'Quick Links', icon: ExternalLink }
      ]
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      children: [
        { id: 'app-users', label: 'App Users', icon: Users },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'access-codes', label: 'Access Codes', icon: Key }
      ]
    },
    {
      id: 'platform',
      label: 'Platform',
      icon: Settings,
      children: [
        { id: 'home-design', label: 'Home Page Design', icon: Palette },
        { id: 'features', label: 'Enabled Features', icon: Settings },
        { id: 'pricing', label: 'Membership Pricing', icon: DollarSign },
        { id: 'settings', label: 'Manage Settings', icon: Settings }
      ]
    }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Getting started</h1>
            <p className="text-gray-600">You're now part of our thriving community of Creators. Before you dive in, complete your onboarding and set up your app. Once everything's ready, start inviting your community and begin earning.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
              Manage
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-2">Account setup complete</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
              Set prices
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-2">Setup pricing for user memberships</h3>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
              Schedule call
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-2">Book a call with us to discuss your goals</h3>
        </div>
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <button className="btn btn-primary px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recipes</h3>
              <p className="text-sm text-gray-600">Manage your recipe collection</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">24</div>
          <p className="text-sm text-gray-600">Total recipes</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Meal Plans</h3>
              <p className="text-sm text-gray-600">Weekly meal planning</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">8</div>
          <p className="text-sm text-gray-600">Active plans</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workouts</h3>
              <p className="text-sm text-gray-600">Exercise routines</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">15</div>
          <p className="text-sm text-gray-600">Workout videos</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
              <p className="text-sm text-gray-600">Educational content</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">5</div>
          <p className="text-sm text-gray-600">Published courses</p>
        </div>
      </div>
    </div>
  )

  const renderSidebarItem = (item: any) => {
    const Icon = item.icon
    const isActive = activeSection === item.id
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <button
          onClick={() => setActiveSection(item.id)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{item.label}</span>
        </button>
        
        {hasChildren && isActive && (
          <div className="ml-8 mt-2 space-y-1">
            {item.children.map((child: any) => {
              const ChildIcon = child.icon
              const isChildActive = activeSection === child.id
              return (
                <button
                  key={child.id}
                  onClick={() => setActiveSection(child.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                    isChildActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChildIcon className="w-4 h-4" />
                  <span className="text-sm">{child.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold">PlantPlanner</span>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map(renderSidebarItem)}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'content' && renderContent()}
          {activeSection === 'recipes' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Recipes Management</h1>
              <div className="card p-6">
                <p className="text-gray-600">Recipe management interface will be implemented here.</p>
              </div>
            </div>
          )}
          {activeSection === 'meal-plans' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Meal Plans Management</h1>
              <div className="card p-6">
                <p className="text-gray-600">Meal plan management interface will be implemented here.</p>
              </div>
            </div>
          )}
          {activeSection === 'workouts' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Workouts Management</h1>
              <div className="card p-6">
                <p className="text-gray-600">Workout management interface will be implemented here.</p>
              </div>
            </div>
          )}
          {activeSection === 'courses' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Courses Management</h1>
              <div className="card p-6">
                <p className="text-gray-600">Course management interface will be implemented here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPortal
