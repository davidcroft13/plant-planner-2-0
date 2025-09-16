import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useStripeContext } from '../contexts/StripeContext'
import { Check, X } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, activateTrial } = useAuth()
  const { createCheckoutSession } = useStripeContext()
  const navigate = useNavigate()

  const pricingPlans = [
    {
      id: 'trial',
      name: '7-Day Free Trial',
      price: 'Free',
      period: '7 days',
      isTrial: true,
      features: ['Full access to all features', '7 days free', 'Cancel anytime', 'No credit card required']
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$19',
      period: 'month',
      popular: true,
      features: ['Full access to all features', 'Unlimited recipes', 'Meal planning', 'Grocery lists', 'Priority support'],
      priceId: 'price_1S5W3IDSvtodK0axFDfA4Fck' // Replace with your actual price ID
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: '$49',
      period: '3 months',
      features: ['Everything in Monthly', 'Save 15%', 'Advanced analytics', 'Export features'],
      priceId: 'price_1S5W3IDSvtodK0axFDfA4Fck' // Replace with your actual price ID
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$179',
      period: 'year',
      features: ['Everything in Quarterly', 'Save 25%', 'Premium features', '1-on-1 consultation', 'Early access to new features'],
      priceId: 'price_1S5W3IDSvtodK0axFDfA4Fck' // Replace with your actual price ID
    }
  ]

  const handleSubscription = async (priceId: string) => {
    setLoading(true)
    setError('')
    
    try {
      if (!user) {
        setError('Please wait for account creation to complete')
        return
      }

      // Wait a moment for user profile to be created
      await new Promise(resolve => setTimeout(resolve, 2000))

      const { error, sessionId } = await createCheckoutSession(priceId, user.id)
      
      if (error) {
        if (error.message?.includes('Backend server not running')) {
          setError('Payment processing is not yet configured. Please contact support or try the free trial.')
        } else {
          setError(error.message || 'Failed to create checkout session')
        }
      } else if (sessionId) {
        // Redirect to Stripe Checkout
        window.location.href = `/checkout?session_id=${sessionId}`
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTrialSelection = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (!user) {
        setError('Please wait for account creation to complete')
        return
      }

      // Wait a moment for user profile to be created
      await new Promise(resolve => setTimeout(resolve, 2000))

      const { error } = await activateTrial()
      if (error) {
        setError(error.message || 'Failed to activate trial')
      } else {
        onClose()
        navigate('/app')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-8">
            Select the plan that best fits your needs. You can change or cancel anytime.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-md p-6 ${
                  plan.popular ? 'ring-2 ring-primary-500' : ''
                } ${plan.isTrial ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.isTrial && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.isTrial ? handleTrialSelection() : handleSubscription(plan.priceId!)}
                  disabled={loading}
                  className={`mt-6 w-full py-2 px-4 rounded-md font-medium ${
                    plan.isTrial
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By choosing a plan, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
