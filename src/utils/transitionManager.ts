import { clearAllCache, forceRefresh } from './cache'
import { authManager } from './authManager'

// Smooth transition manager for critical user flows
export class TransitionManager {
  private static instance: TransitionManager
  private transitionInProgress = false

  static getInstance(): TransitionManager {
    if (!TransitionManager.instance) {
      TransitionManager.instance = new TransitionManager()
    }
    return TransitionManager.instance
  }

  // Handle signup to payment transition
  async handleSignupToPayment(): Promise<void> {
    console.log('🔄 Handling signup to payment transition...')
    
    if (this.transitionInProgress) {
      console.log('⏳ Transition already in progress, waiting...')
      return
    }
    
    this.transitionInProgress = true
    
    try {
      // Clear all cache
      clearAllCache()
      
      // Validate auth state
      const isValid = await authManager.validateAuth()
      
      if (!isValid) {
        console.log('❌ Auth validation failed, forcing refresh')
        forceRefresh()
        return
      }
      
      // Wait a moment for state to settle
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('✅ Signup to payment transition complete')
    } catch (error) {
      console.error('❌ Signup to payment transition failed:', error)
      forceRefresh()
    } finally {
      this.transitionInProgress = false
    }
  }

  // Handle payment to app transition
  async handlePaymentToApp(): Promise<void> {
    console.log('🔄 Handling payment to app transition...')
    
    if (this.transitionInProgress) {
      console.log('⏳ Transition already in progress, waiting...')
      return
    }
    
    this.transitionInProgress = true
    
    try {
      // Clear all cache
      clearAllCache()
      
      // Validate auth state
      const isValid = await authManager.validateAuth()
      
      if (!isValid) {
        console.log('❌ Auth validation failed, forcing refresh')
        forceRefresh()
        return
      }
      
      // Wait for state to settle
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('✅ Payment to app transition complete')
    } catch (error) {
      console.error('❌ Payment to app transition failed:', error)
      forceRefresh()
    } finally {
      this.transitionInProgress = false
    }
  }

  // Handle login transition
  async handleLoginTransition(): Promise<void> {
    console.log('🔄 Handling login transition...')
    
    if (this.transitionInProgress) {
      console.log('⏳ Transition already in progress, waiting...')
      return
    }
    
    this.transitionInProgress = true
    
    try {
      // Clear all cache
      clearAllCache()
      
      // Validate auth state
      const isValid = await authManager.validateAuth()
      
      if (!isValid) {
        console.log('❌ Auth validation failed, forcing refresh')
        forceRefresh()
        return
      }
      
      // Wait for state to settle
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('✅ Login transition complete')
    } catch (error) {
      console.error('❌ Login transition failed:', error)
      forceRefresh()
    } finally {
      this.transitionInProgress = false
    }
  }

  // Handle email verification transition
  async handleEmailVerificationTransition(): Promise<void> {
    console.log('🔄 Handling email verification transition...')
    
    if (this.transitionInProgress) {
      console.log('⏳ Transition already in progress, waiting...')
      return
    }
    
    this.transitionInProgress = true
    
    try {
      // Clear all cache
      clearAllCache()
      
      // Wait for email verification to process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Validate auth state
      const isValid = await authManager.validateAuth()
      
      if (!isValid) {
        console.log('❌ Auth validation failed, forcing refresh')
        forceRefresh()
        return
      }
      
      console.log('✅ Email verification transition complete')
    } catch (error) {
      console.error('❌ Email verification transition failed:', error)
      forceRefresh()
    } finally {
      this.transitionInProgress = false
    }
  }

  // Check if transition is in progress
  isTransitionInProgress(): boolean {
    return this.transitionInProgress
  }

  // Force complete reset
  async forceReset(): Promise<void> {
    console.log('🔄 Force resetting all transitions...')
    
    this.transitionInProgress = false
    clearAllCache()
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Force refresh
    forceRefresh()
  }
}

// Export singleton instance
export const transitionManager = TransitionManager.getInstance()
