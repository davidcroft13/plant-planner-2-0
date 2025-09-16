import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useStripeContext } from '../contexts/StripeContext'
import { X, CreditCard, Calendar } from 'lucide-react'

interface TrialExpiredModalProps {
  isOpen: boolean
  onClose: () => void
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, signOut } = useAuth()
  const { createCheckoutSession } = useStripeContext()

  if (!isOpen) return null

  const handleSubscribe = async (priceId: string) => {
    if (!userProfile?.stripe_customer_id) {
      alert('Please contact support to set up your subscription.')
      return
    }

    const { error, sessionId } = await createCheckoutSession(priceId, userProfile.id)
    
    if (error) {
      alert('Failed to create checkout session. Please try again.')
      return
    }

    if (sessionId) {
      // Redirect to Stripe Checkout
      window.location.href = `/checkout?session_id=${sessionId}`
    }
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trial Expired
          </h2>
          <p className="text-gray-600">
            Your 7-day free trial has ended. Choose a plan to continue using Plant Planner.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Plan</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">$10.00</span>
              <span className="text-gray-600">/month</span>
            </div>
            <button
              onClick={() => handleSubscribe('price_1S5VYiDSvtodK0axECghNUvT')}
              className="w-full mt-3 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Subscribe Monthly
            </button>
          </div>

          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Quarterly Plan</h3>
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">Popular</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">$25.00</span>
              <span className="text-gray-600">/3 months</span>
            </div>
            <button
              onClick={() => handleSubscribe('price_1S5VZADSvtodK0axJMIWByIm')}
              className="w-full mt-3 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Subscribe Quarterly
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Yearly Plan</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">$80.00</span>
              <span className="text-gray-600">/year</span>
            </div>
            <button
              onClick={() => handleSubscribe('price_1S5W3IDSvtodK0axFDfA4Fck')}
              className="w-full mt-3 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Subscribe Yearly
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Sign out instead
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrialExpiredModal
