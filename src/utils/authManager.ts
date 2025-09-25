import supabase from './supabase'
import { clearAllCache, forceRefresh } from './cache'

// Auth state management with automatic recovery
export class AuthManager {
  private static instance: AuthManager
  private authState: 'loading' | 'authenticated' | 'unauthenticated' | 'error' = 'loading'
  private retryCount = 0
  private maxRetries = 3

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  // Force refresh auth state
  async forceRefreshAuth(): Promise<boolean> {
    console.log('🔄 Force refreshing auth state...')
    
    try {
      // Clear all cached data first
      clearAllCache()
      
      // Force a completely fresh session check
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Auth session error:', error)
        this.authState = 'error'
        return false
      }
      
      if (session) {
        console.log('✅ Fresh auth session found')
        this.authState = 'authenticated'
        this.retryCount = 0
        return true
      } else {
        console.log('❌ No auth session found')
        this.authState = 'unauthenticated'
        return false
      }
    } catch (error) {
      console.error('❌ Auth refresh failed:', error)
      this.authState = 'error'
      return false
    }
  }

  // Validate auth with automatic retry
  async validateAuth(): Promise<boolean> {
    if (this.retryCount >= this.maxRetries) {
      console.log('❌ Max retries reached, forcing page refresh')
      forceRefresh()
      return false
    }

    const isValid = await this.forceRefreshAuth()
    
    if (!isValid) {
      this.retryCount++
      console.log(`🔄 Auth validation failed, retry ${this.retryCount}/${this.maxRetries}`)
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount))
      return this.validateAuth()
    }
    
    return true
  }

  // Get current auth state
  getAuthState(): string {
    return this.authState
  }

  // Reset retry count
  resetRetryCount(): void {
    this.retryCount = 0
  }

  // Force complete auth reset
  async resetAuth(): Promise<void> {
    console.log('🔄 Resetting auth completely...')
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear all cache
      clearAllCache()
      
      // Reset state
      this.authState = 'unauthenticated'
      this.retryCount = 0
      
      console.log('✅ Auth reset complete')
    } catch (error) {
      console.error('❌ Auth reset failed:', error)
      // Force refresh anyway
      forceRefresh()
    }
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance()
