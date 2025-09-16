import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SubscriptionModal from './SubscriptionModal'

const SubscriptionChecker: React.FC = () => {
  const { user, userProfile, hasActiveSubscription, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)


  useEffect(() => {
    // Only check if user is logged in, profile is loaded, and we haven't checked yet
    if (user && userProfile && !loading && !hasChecked) {
      console.log('SubscriptionChecker: User logged in, checking subscription status')
      console.log('User:', user.id)
      console.log('UserProfile:', userProfile)
      console.log('HasActiveSubscription:', hasActiveSubscription)
      console.log('Subscription Status:', userProfile.subscription_status)
      
      setHasChecked(true)
      
      // Show modal if user doesn't have an active subscription
      if (!hasActiveSubscription) {
        console.log('SubscriptionChecker: No active subscription, showing modal')
        setShowModal(true)
      } else {
        console.log('SubscriptionChecker: User has active subscription, not showing modal')
      }
    }
  }, [user, userProfile, hasActiveSubscription, loading, hasChecked])

  // Reset check when user logs out
  useEffect(() => {
    if (!user) {
      setHasChecked(false)
      setShowModal(false)
    }
  }, [user])

  return (
    <SubscriptionModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    />
  )
}

export default SubscriptionChecker
