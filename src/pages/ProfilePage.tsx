import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Lock, Camera, Trash2, Settings, CreditCard, BookOpen, MessageCircle, LogOut } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ]

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage your account</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <div className="space-y-6">
              {/* Photo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Photo</h3>
                    <p className="text-sm text-gray-600">Profile picture</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Name</h3>
                  <p className="text-sm text-gray-600">{user?.name || 'David Croft'}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">{user?.email || 'davidcroft15@gmail.com'}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                  <p className="text-sm text-gray-600">hidden</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Delete Account Button */}
              <div className="pt-6 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium">
                  <Trash2 className="w-4 h-4" />
                  <span>I want to remove all my data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab Content */}
      {activeTab === 'preferences' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates about new recipes and features</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified about meal plan reminders</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-600">Switch to dark theme</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab Content */}
      {activeTab === 'billing' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Current Plan</h3>
                  <p className="text-sm text-gray-600">Growth Plan - $50/month</p>
                </div>
                <button className="btn btn-primary px-4 py-2">
                  Manage Subscription
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Payment Method</h3>
                  <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
                </div>
                <button className="btn btn-secondary px-4 py-2">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
