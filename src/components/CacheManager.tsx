import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { clearAllCache } from '../utils/cache'

// Component that automatically clears cache on route changes
const CacheManager: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    // Clear cache when navigating between major sections
    const path = location.pathname
    
    // Clear cache for these critical transitions
    if (
      path.includes('/app') || 
      path.includes('/creator') || 
      path.includes('/admin') ||
      path.includes('/login') ||
      path.includes('/signup')
    ) {
      console.log('Route change detected, clearing cache for:', path)
      clearAllCache()
    }
  }, [location.pathname])

  return null // This component doesn't render anything
}

export default CacheManager
