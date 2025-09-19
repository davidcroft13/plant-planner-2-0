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

// Real API functions that call your Vercel serverless functions
export const createCheckoutSession = async (data: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> => {
  try {
    // Use window.location.origin for production, localhost for development
    const isProduction = window.location.hostname !== 'localhost'
    const baseUrl = isProduction 
      ? (import.meta as any).env.VITE_FRONTEND_URL || window.location.origin
      : 'http://localhost:3000'
    
    console.log('Creating checkout session with:', { data, baseUrl })
    
    const response = await fetch(`${baseUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log('Stripe API response status:', response.status)
    
    // Read response as text first to handle both JSON and non-JSON responses
    const responseText = await response.text()
    console.log('Raw response:', responseText)
    
    let result
    try {
      result = JSON.parse(responseText)
      console.log('Stripe API response:', result)
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      return { error: `Server returned invalid JSON: ${responseText.substring(0, 100)}...` }
    }

    if (!response.ok) {
      console.error('Stripe API error response:', result)
      return { error: result.error || 'Failed to create checkout session' }
    }

    return { sessionId: result.sessionId }
  } catch (error) {
    console.error('Stripe API error:', error)
    return {
      error: `Failed to create checkout session: ${error}`
    }
  }
}

export const createPortalSession = async (data: CreatePortalSessionRequest): Promise<CreatePortalSessionResponse> => {
  try {
    // Use window.location.origin for production, localhost for development
    const isProduction = window.location.hostname !== 'localhost'
    const baseUrl = isProduction 
      ? (import.meta as any).env.VITE_FRONTEND_URL || window.location.origin
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/stripe/create-customer-portal-session`, {
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
