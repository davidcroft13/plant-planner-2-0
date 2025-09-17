import React, { useState } from 'react'
import ProfilePage from './ProfilePage'
import PreferencesPage from './PreferencesPage'
import BillingPage from './BillingPage'

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage your account</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'billing'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Billing
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'preferences' && <PreferencesPage />}
        {activeTab === 'billing' && <BillingPage />}
      </div>
    </div>
  )
}

export default AccountPage
