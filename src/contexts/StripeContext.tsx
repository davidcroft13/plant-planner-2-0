import React, { createContext, useContext, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { createCheckoutSession, createPortalSession, getSubscriptionStatus } from '../api/stripe'

interface StripeContextType {
  stripe: Stripe | null
  loading: boolean
  createCheckoutSession: (priceId: string, userId: string) => Promise<{ error: any; sessionId?: string }>
  createCustomerPortalSession: (customerId: string) => Promise<{ error: any; url?: string }>
  getSubscriptionStatus: (customerId: string) => Promise<{ error: any; status?: string }>
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

// Get Stripe publishable key
const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Missing Stripe publishable key. Stripe functionality will be disabled.')
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

export const useStripeContext = () => {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripeContext must be used within a StripeProvider')
  }
  return context
}

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const handleCreateCheckoutSession = async (priceId: string, userId: string) => {
    if (!stripePublishableKey) {
      return { error: new Error('Stripe not configured') }
    }

    setLoading(true)
    try {
      const result = await createCheckoutSession({ priceId, userId })
      return result
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomerPortalSession = async (customerId: string) => {
    if (!stripePublishableKey) {
      return { error: new Error('Stripe not configured') }
    }

    setLoading(true)
    try {
      const result = await createPortalSession({ customerId })
      return result
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const handleGetSubscriptionStatus = async (customerId: string) => {
    if (!stripePublishableKey) {
      return { error: new Error('Stripe not configured') }
    }

    try {
      const result = await getSubscriptionStatus(customerId)
      return result
    } catch (error) {
      return { error }
    }
  }

  const value = {
    stripe: stripePromise,
    loading,
    createCheckoutSession: handleCreateCheckoutSession,
    createCustomerPortalSession: handleCreateCustomerPortalSession,
    getSubscriptionStatus: handleGetSubscriptionStatus,
  }

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  )
}