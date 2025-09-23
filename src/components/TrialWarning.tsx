import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useStripeContext } from '../contexts/StripeContext'
import { Clock, CreditCard } from 'lucide-react'

const TrialWarning: React.FC = () => {
  const { userProfile, isTrialExpired, daysLeftInTrial } = useAuth()
  const { createCheckoutSession } = useStripeContext()

  // Don't show if user has active subscription or trial hasn't started
  if (!userProfile || userProfile.subscription_status !== 'trial' || isTrialExpired) {
    return null
  }

  const handleUpgrade = async (priceId: string) => {
    if (!userProfile?.stripe_customer_id) {
      alert('Please contact support to set up your subscription.')
      return
    }

    const { error, sessionId } = await createCheckoutSession({ priceId, userId: userProfile.id })
    
    if (error) {
      alert('Failed to create checkout session. Please try again.')
      return
    }

    if (sessionId) {
      // Redirect to Stripe Checkout
      window.location.href = `/checkout?session_id=${sessionId}`
    }
  }

  const getWarningColor = () => {
    if (daysLeftInTrial <= 1) return 'bg-red-50 border-red-200 text-red-800'
    if (daysLeftInTrial <= 3) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const getWarningIcon = () => {
    if (daysLeftInTrial <= 1) return 'text-red-600'
    if (daysLeftInTrial <= 3) return 'text-yellow-600'
    return 'text-blue-600'
  }

  return (
    <div className={`border-l-4 ${getWarningColor()} p-4 mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Clock className={`w-5 h-5 mr-3 ${getWarningIcon()}`} />
          <div>
            <p className="font-medium">
              {daysLeftInTrial === 1 
                ? 'Your trial expires tomorrow!' 
                : `Your trial expires in ${daysLeftInTrial} days`
              }
            </p>
            <p className="text-sm opacity-90">
              Upgrade now to continue using all features
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpgrade('price_1S5VZADSvtodK0axJMIWByIm')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrialWarning
