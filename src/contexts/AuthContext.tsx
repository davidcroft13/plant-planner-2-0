import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient, User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
  subscription_status: 'trial' | 'active' | 'inactive' | 'cancelled'
  stripe_customer_id?: string
  subscription_id?: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  activateTrial: () => Promise<{ error: any }>
  isAdmin: boolean
  hasActiveSubscription: boolean
  isTrialExpired: boolean
  daysLeftInTrial: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Calculate trial status
  const isTrialExpired = userProfile?.subscription_status === 'trial' && userProfile?.trial_ends_at 
    ? new Date(userProfile.trial_ends_at) < new Date()
    : false

  const daysLeftInTrial = userProfile?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(userProfile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const hasActiveSubscription = userProfile?.subscription_status === 'active' || 
    (userProfile?.subscription_status === 'trial' && !isTrialExpired)

  // Debug admin status
  const isAdmin = userProfile?.role === 'admin'
  console.log('AuthContext - userProfile:', userProfile)
  console.log('AuthContext - userProfile.role:', userProfile?.role)
  console.log('AuthContext - isAdmin:', isAdmin)

  // Debug logging
  useEffect(() => {
    if (userProfile) {
      console.log('AuthContext: UserProfile updated:', {
        subscription_status: userProfile.subscription_status,
        trial_ends_at: userProfile.trial_ends_at,
        isTrialExpired,
        hasActiveSubscription
      })
    }
  }, [userProfile, isTrialExpired, hasActiveSubscription])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Check if this is a new user that needs a profile created
          const pendingName = sessionStorage.getItem('pending_user_name')
          if (pendingName) {
            try {
              const { error: profileError } = await supabase
                .from('users')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: pendingName,
                  role: 'user',
                  subscription_status: 'inactive',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })

              if (profileError) {
                console.error('Error creating user profile:', profileError)
              } else {
                // Clear the pending name
                sessionStorage.removeItem('pending_user_name')
              }
            } catch (err) {
              console.error('Error creating user profile:', err)
            }
          }
          
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setLoading(false)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error('Sign in error:', error)
        console.error('Error details:', {
          message: error.message,
          status: error.status
        })
      } else {
        console.log('Sign in successful', data)
      }
      return { error }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting to sign up with:', email, fullName)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName
          }
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        return { error }
      }

      // Store the full name for later use in profile creation
      if (data.user) {
        console.log('User created successfully, storing name for profile creation')
        // Store the name in session storage for the auth state change handler
        sessionStorage.setItem('pending_user_name', fullName)
      }

      console.log('SignUp completed successfully')
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const activateTrial = async () => {
    try {
      if (!user) {
        console.error('No user found when activating trial')
        return { error: { message: 'No user found. Please try signing up again.' } }
      }

      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 7) // 7 days from now

      console.log('Activating trial for user:', user.id)

      // Use upsert to either update existing profile or create new one
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'User',
          role: 'user',
          subscription_status: 'trial',
          trial_ends_at: trialEndsAt.toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      console.log('Upsert result:', { upsertError })

      if (upsertError) {
        console.error('Error upserting user profile for trial:', upsertError)
        return { error: { message: `Failed to activate trial: ${upsertError.message}` } }
      }

      // Refresh user profile
      await fetchUserProfile(user.id)
      console.log('Trial activated successfully')
      return { error: null }
    } catch (error) {
      console.error('Error activating trial:', error)
      return { error: { message: 'An unexpected error occurred. Please try again.' } }
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    activateTrial,
    isAdmin: userProfile?.role === 'admin',
    hasActiveSubscription,
    isTrialExpired,
    daysLeftInTrial
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}