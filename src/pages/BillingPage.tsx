import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useStripeContext } from '../contexts/StripeContext'
import { createClient } from '@supabase/supabase-js'
import { CreditCard, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface BillingInfo {
  subscription_status: string
  current_period_end: string
  plan_name: string
  plan_price: number
  billing_cycle: 'monthly' | 'yearly'
  next_billing_date: string
  cancel_at_period_end: boolean
  stripe_customer_id?: string
}

const BillingPage: React.FC = () => {
  const { user } = useAuth()
  const { createCheckoutSession, createCustomerPortalSession } = useStripeContext()
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    loadBillingInfo()
  }, [user])

  const loadBillingInfo = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_status, trial_ends_at')
        .eq('id', user.id)
        .single()

      if (error) throw error

      // Mock billing info for now - in production, this would come from Stripe
      setBillingInfo({
        subscription_status: data?.subscription_status || 'trial',
        current_period_end: data?.trial_ends_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        plan_name: data?.subscription_status === 'active' ? 'Pro Plan' : 'Free Trial',
        plan_price: data?.subscription_status === 'active' ? 29.99 : 0,
        billing_cycle: 'monthly',
        next_billing_date: data?.trial_ends_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      })
    } catch (error) {
      console.error('Error loading billing info:', error)
    }
  }

  const handleUpgradePlan = async () => {
    setLoading(true)
    try {
      const { error } = await createCheckoutSession(user?.id || '', 'monthly')
      if (error) {
        alert('Error creating checkout session. Please try again.')
        return
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
      alert('Error upgrading plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    if (!billingInfo?.stripe_customer_id) {
      alert('No billing information available. Please contact support.')
      return
    }
    
    setLoading(true)
    try {
      const { error } = await createCustomerPortalSession(billingInfo.stripe_customer_id)
      if (error) {
        alert('Error opening billing portal. Please try again.')
        return
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      alert('Error opening billing portal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    try {
      // In production, this would call Stripe API to cancel subscription
      // For now, we'll just show a success message
      alert('Subscription will be cancelled at the end of the current billing period.')
      setShowCancelModal(false)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Error cancelling subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'trial':
        return 'text-blue-600 bg-blue-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div>
      {/* Billing Content */}
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Current Plan</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(billingInfo?.subscription_status || 'trial')}`}>
                  {billingInfo?.subscription_status === 'active' ? 'Active' : 
                   billingInfo?.subscription_status === 'trial' ? 'Free Trial' : 
                   'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-semibold text-gray-900">{billingInfo?.plan_name || 'Free Trial'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Billing Cycle</p>
                    <p className="font-semibold text-gray-900 capitalize">{billingInfo?.billing_cycle || 'Monthly'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-gray-900">
                      {billingInfo?.plan_price ? `$${billingInfo.plan_price}` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>

              {billingInfo?.next_billing_date && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {billingInfo.subscription_status === 'trial' ? 'Trial ends on' : 'Next billing date'}: 
                    <span className="font-medium ml-1">{formatDate(billingInfo.next_billing_date)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Plan Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Plan */}
                <div className="border border-gray-200 rounded-xl p-6 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Monthly Plan</h4>
                    <span className="text-2xl font-bold text-gray-900">$29.99</span>
                  </div>
                  <p className="text-gray-600 mb-4">Billed monthly</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Unlimited recipes
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Meal planning
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Workout plans
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Priority support
                    </li>
                  </ul>
                  <button
                    onClick={handleUpgradePlan}
                    disabled={loading || billingInfo?.subscription_status === 'active'}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {billingInfo?.subscription_status === 'active' ? 'Current Plan' : 'Upgrade to Monthly'}
                  </button>
                </div>

                {/* Yearly Plan */}
                <div className="border border-gray-200 rounded-xl p-6 hover:border-green-500 transition-colors relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Save 20%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Yearly Plan</h4>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">$287.90</span>
                      <span className="text-sm text-gray-500 ml-1">/year</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Billed annually</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Everything in Monthly
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Early access to features
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      20% savings
                    </li>
                  </ul>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    disabled={loading || billingInfo?.subscription_status === 'active'}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {billingInfo?.subscription_status === 'active' ? 'Current Plan' : 'Upgrade to Yearly'}
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Management */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Billing Management</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleManageBilling}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Manage Payment Methods</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={loading || billingInfo?.subscription_status !== 'active'}
                  className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-600">Cancel Subscription</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>
          </div>

      {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Your subscription will remain active until the end of your current billing period. 
                You can reactivate your subscription at any time.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade to Yearly Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upgrade to Yearly</h3>
                  <p className="text-sm text-gray-600">Save 20% with annual billing</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">You'll save:</span>
                  <span className="text-lg font-bold text-green-600">$72.10/year</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // In production, this would create a checkout session for yearly plan
                    alert('Yearly plan upgrade coming soon!')
                    setShowUpgradeModal(false)
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default BillingPage
