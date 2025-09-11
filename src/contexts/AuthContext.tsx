import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

const supabase = createClient(supabaseUrl, supabaseKey)

interface User {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
  subscription_status?: 'active' | 'inactive' | 'cancelled'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock mode - set a default user for demo purposes
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      setUser({
        id: 'demo-user',
        email: 'demo@plantplanner.com',
        name: 'Demo User',
        role: 'user',
        subscription_status: 'active'
      })
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
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

      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      // Mock sign in
      setUser({
        id: 'demo-user',
        email: email,
        name: 'Demo User',
        role: 'user',
        subscription_status: 'active'
      })
      return
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name?: string) => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      // Mock sign up
      setUser({
        id: 'demo-user',
        email: email,
        name: name || 'Demo User',
        role: 'user',
        subscription_status: 'active'
      })
      return
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name || '',
          role: 'user',
          subscription_status: 'inactive'
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }
  }

  const signOut = async () => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      // Mock sign out
      setUser(null)
      return
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
