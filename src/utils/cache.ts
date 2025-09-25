// Aggressive cache management utilities for production-ready app
import supabase from './supabase'

export const CACHE_VERSION = '2.0.0'
export const CACHE_KEY_PREFIX = `plant_planner_${CACHE_VERSION}`

// Generate a unique cache key with version and timestamp
export const generateCacheKey = (key: string): string => {
  return `${CACHE_KEY_PREFIX}_${key}_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

// Nuclear option - clear EVERYTHING
export const clearAllCache = (): void => {
  console.log('🧹 Clearing all cache...')
  
  // Clear localStorage completely
  try {
    localStorage.clear()
  } catch (e) {
    console.warn('Could not clear localStorage:', e)
  }
  
  // Clear sessionStorage completely
  try {
    sessionStorage.clear()
  } catch (e) {
    console.warn('Could not clear sessionStorage:', e)
  }
  
  // Clear IndexedDB
  if ('indexedDB' in window) {
    try {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          if (db.name && (db.name.includes('plant') || db.name.includes('supabase'))) {
            indexedDB.deleteDatabase(db.name)
          }
        })
      })
    } catch (e) {
      console.warn('Could not clear IndexedDB:', e)
    }
  }
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name)
      })
    })
  }
  
  // Clear any service worker caches
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
      })
    })
  }
  
  console.log('✅ All cache cleared')
}

// Force refresh by adding aggressive cache-busting parameters
export const addCacheBusting = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `${url}${separator}_cb=${timestamp}&_v=${CACHE_VERSION}&_r=${random}&_t=${performance.now()}`
}

// Check if cache is stale (older than 1 minute for production)
export const isCacheStale = (timestamp: number): boolean => {
  const oneMinute = 1 * 60 * 1000
  return Date.now() - timestamp > oneMinute
}

// Get aggressive cache-busting headers for API calls
export const getCacheBustingHeaders = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Cache-Bust': timestamp.toString(),
    'X-Request-ID': random,
    'X-Cache-Version': CACHE_VERSION,
    'X-Timestamp': timestamp.toString(),
    'X-Random': random,
    'If-Modified-Since': '0',
    'If-None-Match': '*'
  }
}

// Force refresh the current page
export const forceRefresh = (): void => {
  console.log('🔄 Force refreshing page...')
  clearAllCache()
  window.location.reload()
}

// Force refresh with cache bypass
export const forceHardRefresh = (): void => {
  console.log('🔄 Force hard refreshing page...')
  clearAllCache()
  window.location.href = window.location.href + '?refresh=' + Date.now()
}

// Validate and refresh auth state
export const validateAndRefreshAuth = async (): Promise<boolean> => {
  try {
    // Clear any stale auth data
    clearAllCache()
    
    // Force a fresh auth check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('✅ Auth state validated')
      return true
    } else {
      console.log('❌ No valid session found')
      return false
    }
  } catch (error) {
    console.error('❌ Auth validation failed:', error)
    return false
  }
}
