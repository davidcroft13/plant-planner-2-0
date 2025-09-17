import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Settings, HelpCircle, User, LogOut, CreditCard, BookOpen, MessageCircle, ExternalLink } from 'lucide-react'

const Header: React.FC = () => {
  const { user, userProfile, signOut, isAdmin } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  // Debug logging
  console.log('Header - user:', user)
  console.log('Header - userProfile:', userProfile)
  console.log('Header - isAdmin:', isAdmin)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-tight">Plant Planner</span>
            <span className="text-xs text-gray-500 -mt-1">Healthy Living Made Simple</span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Help</span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 bg-gray-50 rounded-full px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {(userProfile?.name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{userProfile?.name || 'User'}</span>
                <span className="text-xs text-gray-500">View Profile</span>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userProfile?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="py-1">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <CreditCard className="w-4 h-4" />
                    <span>Manage Billing</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <BookOpen className="w-4 h-4" />
                    <span>Read the guide</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact support</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => navigate('/creator')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-primary-600 hover:bg-gray-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Creator Portal</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header