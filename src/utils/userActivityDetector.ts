// User activity detector to prevent cache clearing during active use
class UserActivityDetector {
  private static instance: UserActivityDetector
  private lastActivityTime = 0
  private activityTimeout: NodeJS.Timeout | null = null
  private readonly INACTIVITY_THRESHOLD = 30000 // 30 seconds

  static getInstance(): UserActivityDetector {
    if (!UserActivityDetector.instance) {
      UserActivityDetector.instance = new UserActivityDetector()
    }
    return UserActivityDetector.instance
  }

  constructor() {
    this.setupActivityListeners()
  }

  private setupActivityListeners(): void {
    // Track mouse movement
    document.addEventListener('mousemove', () => this.recordActivity())
    
    // Track clicks
    document.addEventListener('click', () => this.recordActivity())
    
    // Track keyboard input
    document.addEventListener('keydown', () => this.recordActivity())
    
    // Track scrolling
    document.addEventListener('scroll', () => this.recordActivity())
    
    // Track touch events (mobile)
    document.addEventListener('touchstart', () => this.recordActivity())
    document.addEventListener('touchmove', () => this.recordActivity())
  }

  private recordActivity(): void {
    this.lastActivityTime = Date.now()
    
    // Clear any existing timeout
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout)
    }
    
    // Set user as inactive after threshold
    this.activityTimeout = setTimeout(() => {
      console.log('👤 User became inactive')
    }, this.INACTIVITY_THRESHOLD)
  }

  // Check if user is currently active
  isActive(): boolean {
    const timeSinceActivity = Date.now() - this.lastActivityTime
    return timeSinceActivity < this.INACTIVITY_THRESHOLD
  }

  // Get time since last activity
  getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivityTime
  }

  // Force set user as active (for programmatic actions)
  setActive(): void {
    this.recordActivity()
  }
}

// Export singleton instance
export const userActivityDetector = UserActivityDetector.getInstance()
