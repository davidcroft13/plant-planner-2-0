import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Home, ChefHat, BookOpen, Calendar, User, Activity } from 'lucide-react'

const BottomNavigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/app', icon: Home, label: 'Home' },
    { path: '/app/recipes', icon: ChefHat, label: 'Recipes' },
    { path: '/app/courses', icon: BookOpen, label: 'Courses' },
    { path: '/app/plans', icon: Calendar, label: 'Plans' },
    { path: '/app/workouts', icon: Activity, label: 'Move' },
    { path: '/app/account', icon: User, label: 'Account' },
  ]

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3 z-40 max-w-md mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                active
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
