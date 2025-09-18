import React, { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useStripeContext } from '../contexts/StripeContext'

interface SubscriptionRequiredModalProps {
  isOpen: boolean
  onClose: () => void
}

const SubscriptionRequiredModal: React.FC<SubscriptionRequiredModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, signOut } = useAuth()
  const { createCheckoutSession } = useStripeContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubscription = async (priceId: string) => {
    if (!userProfile) return

    setLoading(true)
    setError('')

    try {
      const { error, sessionId } = await createCheckoutSession(priceId, userProfile.id)
      
      if (error) {
        setError(error || 'Failed to create checkout session. Please try again.')
        return
      }

      if (sessionId) {
        // Redirect to Stripe Checkout
        window.location.href = `/checkout?session_id=${sessionId}`
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const pricingPlans = [
    {
      id: 'monthly',
      name: 'Monthly Subscription',
      price: '$10.00',
      period: 'month',
      features: ['Access to all recipes', 'Meal planning tools', 'Grocery list generator', 'Basic support'],
      priceId: 'price_1S5VYiDSvtodK0axECghNUvT'
    },
    {
      id: 'quarterly',
      name: 'Quarterly Subscription',
      price: '$25.00',
      period: '3 months',
      features: ['Everything in Monthly', 'Advanced meal planning', 'Nutrition tracking', 'Priority support'],
      priceId: 'price_1S5VZADSvtodK0axJMIWByIm',
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly Subscription',
      price: '$80.00',
      period: 'year',
      features: ['Everything in Quarterly', 'Premium features', '1-on-1 consultation', 'Early access to new features'],
      priceId: 'price_1S5W3IDSvtodK0axFDfA4Fck'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-4">
              To access all features of Plant Planner, please choose a subscription plan.
            </p>
            <p className="text-sm text-gray-500">
              All plans include full access to recipes, meal planning, and more!
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg border-2 p-6 ${
                  plan.popular ? 'border-primary-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscription(plan.priceId)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionRequiredModal
