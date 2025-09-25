import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { clearAllCache } from '../utils/cache'
import { authManager } from '../utils/authManager'

// Component that automatically clears cache on route changes
const CacheManager: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    // Clear cache on EVERY route change for maximum reliability
    const path = location.pathname
    
    console.log('🔄 Route change detected, clearing cache for:', path)
    
    // Always clear cache on route changes
    clearAllCache()
    
    // Validate auth state on critical routes
    if (
      path.includes('/app') || 
      path.includes('/creator') || 
      path.includes('/admin') ||
      path.includes('/login') ||
      path.includes('/signup') ||
      path.includes('/checkout')
    ) {
      console.log('🔐 Validating auth state for critical route:', path)
      authManager.validateAuth()
    }
  }, [location.pathname])

  return null // This component doesn't render anything
}

export default CacheManager
