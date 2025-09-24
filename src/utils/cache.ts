// Cache management utilities
export const CACHE_VERSION = '1.0.0'
export const CACHE_KEY_PREFIX = `plant_planner_${CACHE_VERSION}`

// Generate a unique cache key with version and timestamp
export const generateCacheKey = (key: string): string => {
  return `${CACHE_KEY_PREFIX}_${key}_${Date.now()}`
}

// Clear all cached data
export const clearAllCache = (): void => {
  // Clear localStorage
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
  
  // Clear sessionStorage
  sessionStorage.clear()
  
  // Clear any cached data in memory
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('plant-planner') || name.includes('plant_planner')) {
          caches.delete(name)
        }
      })
    })
  }
}

// Force refresh by adding cache-busting parameters
export const addCacheBusting = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_cb=${Date.now()}&_v=${CACHE_VERSION}`
}

// Check if cache is stale (older than 5 minutes)
export const isCacheStale = (timestamp: number): boolean => {
  const fiveMinutes = 5 * 60 * 1000
  return Date.now() - timestamp > fiveMinutes
}

// Get cache-busting headers for API calls
export const getCacheBustingHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Cache-Bust': Date.now().toString(),
  'X-Request-ID': Math.random().toString(36).substring(7),
  'X-Cache-Version': CACHE_VERSION
})
