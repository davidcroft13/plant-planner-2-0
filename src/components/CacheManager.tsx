import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { debouncedCacheManager } from '../utils/debouncedCache'
import { authManager } from '../utils/authManager'

// Component that intelligently manages cache on route changes
const CacheManager: React.FC = () => {
  const location = useLocation()
  const lastPathRef = useRef<string>('')
  const lastClearTimeRef = useRef<number>(0)

  useEffect(() => {
    const path = location.pathname
    const now = Date.now()
    
    // Only clear cache if we've actually changed routes and enough time has passed
    if (path !== lastPathRef.current && now - lastClearTimeRef.current > 2000) {
      console.log('🔄 Route change detected, clearing cache for:', path)
      
      // Only clear cache for major section changes, not within the same section
      const isMajorSectionChange = (
        (lastPathRef.current.includes('/app') && !path.includes('/app')) ||
        (lastPathRef.current.includes('/creator') && !path.includes('/creator')) ||
        (lastPathRef.current.includes('/admin') && !path.includes('/admin')) ||
        (lastPathRef.current.includes('/login') && !path.includes('/login')) ||
        (lastPathRef.current.includes('/signup') && !path.includes('/signup')) ||
        (lastPathRef.current.includes('/checkout') && !path.includes('/checkout')) ||
        (!lastPathRef.current.includes('/app') && path.includes('/app')) ||
        (!lastPathRef.current.includes('/creator') && path.includes('/creator')) ||
        (!lastPathRef.current.includes('/admin') && path.includes('/admin')) ||
        (!lastPathRef.current.includes('/login') && path.includes('/login')) ||
        (!lastPathRef.current.includes('/signup') && path.includes('/signup')) ||
        (!lastPathRef.current.includes('/checkout') && path.includes('/checkout'))
      )
      
      if (isMajorSectionChange) {
        debouncedCacheManager.debouncedClear()
        lastClearTimeRef.current = now
      }
      
      lastPathRef.current = path
    }
    
    // Only validate auth state on critical routes, not on every change
    if (
      path.includes('/app') || 
      path.includes('/creator') || 
      path.includes('/admin')
    ) {
      console.log('🔐 Validating auth state for critical route:', path)
      authManager.validateAuth()
    }
  }, [location.pathname])

  return null // This component doesn't render anything
}

export default CacheManager
