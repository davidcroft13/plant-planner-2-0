import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { debouncedCacheManager } from '../utils/debouncedCache'
import { authManager } from '../utils/authManager'

// Component that very conservatively manages cache on route changes
const CacheManager: React.FC = () => {
  const location = useLocation()
  const lastPathRef = useRef<string>('')
  const lastClearTimeRef = useRef<number>(0)

  useEffect(() => {
    const path = location.pathname
    const now = Date.now()
    
    // Only clear cache for very specific critical transitions
    if (path !== lastPathRef.current && now - lastClearTimeRef.current > 10000) { // 10 seconds minimum
      console.log('🔄 Route change detected:', path)
      
      // Only clear cache for critical auth transitions, not browsing
      const isCriticalAuthTransition = (
        // Login/signup to app
        (lastPathRef.current.includes('/login') && path.includes('/app')) ||
        (lastPathRef.current.includes('/signup') && path.includes('/app')) ||
        // Checkout to app (after payment)
        (lastPathRef.current.includes('/checkout') && path.includes('/app')) ||
        // App to creator (admin access)
        (lastPathRef.current.includes('/app') && path.includes('/creator')) ||
        // Logout transitions
        (lastPathRef.current.includes('/app') && !path.includes('/app') && !path.includes('/creator'))
      )
      
      if (isCriticalAuthTransition) {
        console.log('🧹 Critical auth transition detected, clearing cache')
        debouncedCacheManager.debouncedClear()
        lastClearTimeRef.current = now
      }
      
      lastPathRef.current = path
    }
    
    // Only validate auth state on initial app load, not on every change
    if (path.includes('/app') && !lastPathRef.current.includes('/app')) {
      console.log('🔐 Initial app load, validating auth state')
      authManager.validateAuth()
    }
  }, [location.pathname])

  return null // This component doesn't render anything
}

export default CacheManager
