import { clearAllCache } from './cache'

// Debounced cache management to prevent rapid clearing
class DebouncedCacheManager {
  private static instance: DebouncedCacheManager
  private clearTimeout: NodeJS.Timeout | null = null
  private lastClearTime = 0
  private readonly MIN_CLEAR_INTERVAL = 3000 // 3 seconds minimum between clears

  static getInstance(): DebouncedCacheManager {
    if (!DebouncedCacheManager.instance) {
      DebouncedCacheManager.instance = new DebouncedCacheManager()
    }
    return DebouncedCacheManager.instance
  }

  // Debounced cache clear - only clears if enough time has passed
  debouncedClear(): void {
    const now = Date.now()
    
    // If we've cleared recently, don't clear again
    if (now - this.lastClearTime < this.MIN_CLEAR_INTERVAL) {
      console.log('⏳ Cache clear skipped - too recent')
      return
    }

    // Clear any pending clear
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout)
    }

    // Schedule a clear after a short delay
    this.clearTimeout = setTimeout(() => {
      console.log('🧹 Debounced cache clear executing...')
      clearAllCache()
      this.lastClearTime = Date.now()
      this.clearTimeout = null
    }, 500) // 500ms delay
  }

  // Force immediate clear (for critical situations)
  forceClear(): void {
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout)
      this.clearTimeout = null
    }
    
    console.log('🧹 Force cache clear executing...')
    clearAllCache()
    this.lastClearTime = Date.now()
  }

  // Check if we can clear cache
  canClear(): boolean {
    const now = Date.now()
    return now - this.lastClearTime >= this.MIN_CLEAR_INTERVAL
  }
}

// Export singleton instance
export const debouncedCacheManager = DebouncedCacheManager.getInstance()
