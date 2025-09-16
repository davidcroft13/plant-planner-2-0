// Stripe API integration functions
// These would typically be server-side functions, but for demo purposes we'll create client-side versions

export interface CreateCheckoutSessionRequest {
  priceId: string
  userId: string
}

export interface CreateCheckoutSessionResponse {
  sessionId?: string
  error?: string
}

export interface CreatePortalSessionRequest {
  customerId: string
}

export interface CreatePortalSessionResponse {
  url?: string
  error?: string
}

// Real API functions that call your backend
export const createCheckoutSession = async (data: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> => {
  try {
    const response = await fetch('http://localhost:3001/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to create checkout session' }
    }

    return { sessionId: result.sessionId }
  } catch (error) {
    console.error('Stripe API error:', error)
    return {
      error: 'Backend server not running. Please start the backend server with: cd backend && npm run dev'
    }
  }
}

export const createPortalSession = async (data: CreatePortalSessionRequest): Promise<CreatePortalSessionResponse> => {
  try {
    const response = await fetch('http://localhost:3001/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to create portal session' }
    }

    return { url: result.url }
  } catch (error) {
    return {
      error: 'Failed to create portal session'
    }
  }
}

export const getSubscriptionStatus = async (customerId: string): Promise<{ status?: string; error?: string }> => {
  try {
    const response = await fetch(`http://localhost:3001/api/stripe/subscription-status?customerId=${customerId}`)
    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to get subscription status' }
    }

    return { status: result.status }
  } catch (error) {
    return {
      error: 'Failed to get subscription status'
    }
  }
}
