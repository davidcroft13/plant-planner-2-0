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
    
    console.log('=== CREATING CHECKOUT SESSION ===')
    console.log('Data:', data)
    console.log('Base URL:', baseUrl)
    console.log('Is Production:', isProduction)
    
    // Add cache-busting parameter to prevent caching issues
    const timestamp = Date.now()
    const url = `${baseUrl}/api/stripe/create-checkout-session?t=${timestamp}`
    console.log('Full URL:', url)
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Cache-Bust': Date.now().toString(),
        'X-Request-ID': Math.random().toString(36).substring(7)
      },
      body: JSON.stringify(data),
    }
    
    console.log('Request options:', requestOptions)
    
    const response = await fetch(url, requestOptions)

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('Response ok:', response.ok)
    
    // Read response as text first to handle both JSON and non-JSON responses
    const responseText = await response.text()
    console.log('Raw response text length:', responseText.length)
    console.log('Raw response text:', responseText)
    
    // Check if response is empty
    if (!responseText || responseText.trim() === '') {
      console.error('Empty response received')
      return { error: 'Server returned empty response' }
    }
    
    let result
    try {
      result = JSON.parse(responseText)
      console.log('Parsed JSON result:', result)
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      console.error('Response that failed to parse:', responseText)
      return { 
        error: `Server returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 200)}...` 
      }
    }

    if (!response.ok) {
      console.error('HTTP error response:', result)
      return { error: result.error || `HTTP ${response.status}: Failed to create checkout session` }
    }

    if (!result.sessionId) {
      console.error('No sessionId in response:', result)
      return { error: 'No session ID returned from server' }
    }

    console.log('Success! Session ID:', result.sessionId)
    return { sessionId: result.sessionId }
  } catch (error: any) {
    console.error('=== STRIPE API ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Full error:', error)
    return {
      error: `Network error: ${error?.message || 'Unknown error'}`
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
    
    // Add cache-busting parameter to prevent caching issues
    const timestamp = Date.now()
    const url = `${baseUrl}/api/stripe/create-customer-portal-session?t=${timestamp}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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
