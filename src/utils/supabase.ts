import { createClient } from '@supabase/supabase-js'
import { getCacheBustingHeaders } from './cache'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

// Create Supabase client with aggressive cache-busting
const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: getCacheBustingHeaders()
  },
  auth: {
    // Force fresh auth checks
    autoRefreshToken: true,
    persistSession: false, // Don't persist sessions to avoid stale data
    detectSessionInUrl: true
  }
})

// Override the default fetch to add cache-busting to every request
const originalFetch = window.fetch
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  
  // Add cache-busting to all Supabase requests
  if (url.includes(supabaseUrl)) {
    const separator = url.includes('?') ? '&' : '?'
    const cacheBustedUrl = `${url}${separator}_cb=${Date.now()}&_r=${Math.random().toString(36).substring(7)}`
    
    const enhancedInit = {
      ...init,
      headers: {
        ...getCacheBustingHeaders(),
        ...init?.headers
      }
    }
    
    return originalFetch(cacheBustedUrl, enhancedInit)
  }
  
  return originalFetch(input, init)
}

// Helper function to add cache-busting to any query
export const addCacheBusting = (query: any) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return query.eq('cache_bust', timestamp).eq('random', random) // This will always fail, but forces fresh data
}

// Force refresh all data
export const forceRefreshData = async () => {
  console.log('🔄 Force refreshing all data...')
  
  // Clear all cache
  const { clearAllCache } = await import('./cache')
  clearAllCache()
  
  // Force a fresh session check
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    console.log('✅ Fresh session found, data should be fresh')
    return true
  } else {
    console.log('❌ No session found')
    return false
  }
}

export default supabase
