import React, { createContext, useContext, useEffect, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY

interface StripeContextType {
  stripe: Stripe | null
  loading: boolean
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (stripePublishableKey && stripePublishableKey !== 'your_stripe_publishable_key_here') {
      loadStripe(stripePublishableKey).then((stripeInstance) => {
        setStripe(stripeInstance)
        setLoading(false)
      })
    } else {
      console.warn('Stripe publishable key not found - using mock mode')
      setLoading(false)
    }
  }, [])

  const value = {
    stripe,
    loading
  }

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  )
}
