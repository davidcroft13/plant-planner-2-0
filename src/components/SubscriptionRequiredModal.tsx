import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useStripeContext } from '../contexts/StripeContext'
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface SubscriptionRequiredModalProps {
  isOpen: boolean
}

const SubscriptionRequiredModal: React.FC<SubscriptionRequiredModalProps> = ({ isOpen }) => {
  const { userProfile } = useAuth()
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

  const handleTrial = async () => {
    if (!userProfile) return

    setLoading(true)
    setError('')

    try {
      // Activate trial by updating user profile
      const { error } = await supabase
        .from('users')
        .update({
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id)

      if (error) {
        setError('Failed to activate trial. Please try again.')
        return
      }

      // Close modal and refresh page to update auth state
      window.location.reload()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const pricingPlans = [
    {
      id: 'trial',
      name: '7-Day Free Trial',
      price: 'Free',
      period: '7 days',
      features: ['Full access to all features', 'No credit card required', 'Cancel anytime', 'Perfect way to try us out'],
      isTrial: true
    },
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
            {/* Remove close button - users must select a plan */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg border-2 p-4 ${
                  plan.popular ? 'border-primary-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                      Popular
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
                  onClick={() => plan.isTrial ? handleTrial() : handleSubscription(plan.priceId!)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
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

          {/* Removed sign out button - users must select a plan */}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionRequiredModal
