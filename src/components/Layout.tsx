import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import IntercomWidget from './IntercomWidget'
import TrialWarning from './TrialWarning'
import TrialExpiredModal from './TrialExpiredModal'
import SubscriptionRequiredModal from './SubscriptionRequiredModal'

const Layout: React.FC = () => {
  const { isTrialExpired, userProfile, hasActiveSubscription, loading } = useAuth()
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false)
  const [showSubscriptionRequiredModal, setShowSubscriptionRequiredModal] = useState(false)

  // Show trial expired modal if trial is expired
  React.useEffect(() => {
    if (isTrialExpired) {
      setShowTrialExpiredModal(true)
    }
  }, [isTrialExpired])

  // Show subscription required modal for inactive users
  React.useEffect(() => {
    console.log('Layout - Checking subscription modal:', {
      userProfile,
      subscription_status: userProfile?.subscription_status,
      hasActiveSubscription,
      loading,
      shouldShowModal: userProfile && userProfile.subscription_status === 'inactive' && !hasActiveSubscription && !loading
    })
    
    // Only show modal if user is fully loaded and inactive
    if (userProfile && !loading && userProfile.subscription_status === 'inactive' && !hasActiveSubscription) {
      console.log('Layout - Showing subscription required modal')
      setShowSubscriptionRequiredModal(true)
    }
  }, [userProfile, hasActiveSubscription, loading])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20">
        <TrialWarning />
        <Outlet />
      </main>
      <BottomNavigation />
      <IntercomWidget />
      
      <TrialExpiredModal 
        isOpen={showTrialExpiredModal}
        onClose={() => setShowTrialExpiredModal(false)}
      />
      
      <SubscriptionRequiredModal 
        isOpen={showSubscriptionRequiredModal}
      />
    </div>
  )
}

export default Layout