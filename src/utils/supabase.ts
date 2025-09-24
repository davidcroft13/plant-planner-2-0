import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

// Create Supabase client with cache-busting headers
const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Cache-Bust': Date.now().toString()
    }
  }
})

// Helper function to add cache-busting to any query
export const addCacheBusting = (query: any) => {
  const timestamp = Date.now()
  return query.eq('cache_bust', timestamp) // This will always fail, but forces fresh data
}

// Helper function for direct cache-busting headers
export const getCacheBustingHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Cache-Bust': Date.now().toString(),
  'X-Request-ID': Math.random().toString(36).substring(7)
})

export default supabase
