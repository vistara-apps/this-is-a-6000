import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import { supabase } from '../config/supabase'
import { paymentService } from '../services/paymentService'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [papers, setPapers] = useState([])
  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  // Initialize user and check authentication
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if user is authenticated
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Auth error:', error)
          // Don't throw error for missing sessions, just use demo mode
          if (error.message?.includes('AuthSessionMissingError') || error.message?.includes('session missing')) {
            console.log('No auth session found, using demo mode')
            setDemoUser()
            return
          }
          // Fall back to demo user for other auth errors
          setDemoUser()
          return
        }

        if (authUser) {
          try {
            // Get user profile from database
            const { data: profile, error: profileError } = await supabase
              .from('paperforge_users')
              .select('*')
              .eq('id', authUser.id)
              .single()

            if (profileError) {
              console.error('Profile fetch error:', profileError)
              // If RLS blocks access or user doesn't exist, create new user profile
              if (profileError.code === 'PGRST116' || profileError.message?.includes('row-level security')) {
                await createUserProfile(authUser)
              } else {
                // Other errors, fall back to demo
                setDemoUser()
              }
            } else {
              // Get usage stats
              try {
                const usageStats = await paymentService.getUserUsageStats(authUser.id)
                
                setUser({
                  ...profile,
                  monthlyConversionsUsed: usageStats.monthlyConversions,
                  totalConversions: usageStats.totalConversions,
                  totalSpent: usageStats.totalSpent
                })
              } catch (statsError) {
                console.error('Error fetching usage stats:', statsError)
                // Set user without stats
                setUser({
                  ...profile,
                  monthlyConversionsUsed: 0,
                  totalConversions: 0,
                  totalSpent: 0
                })
              }
            }
          } catch (dbError) {
            console.error('Database access error:', dbError)
            setDemoUser()
          }
        } else {
          // No authenticated user, use demo user
          setDemoUser()
        }
      } catch (error) {
        console.error('User initialization error:', error)
        // Always fall back to demo user on any error
        setDemoUser()
      }
    }

    initializeUser()
  }, [])

  const setDemoUser = () => {
    setUser({
      id: 'demo-user-1',
      email: 'demo@paperforge.ai',
      subscription_tier: 'free',
      monthly_conversions_limit: 1,
      monthlyConversionsUsed: 0,
      totalConversions: 0,
      totalSpent: 0,
      researchInterests: ['Computer Vision', 'NLP'],
      preferredFrameworks: ['PyTorch', 'TensorFlow'],
      isDemo: true
    })
  }

  const createUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('paperforge_users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          subscription_tier: 'free',
          monthly_conversions_limit: 1,
          research_interests: ['Computer Vision', 'NLP'],
          preferred_frameworks: ['PyTorch', 'TensorFlow']
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        // If RLS policy prevents insertion or other DB errors, fall back to demo
        setDemoUser()
        return
      }

      setUser({
        ...data,
        monthlyConversionsUsed: 0,
        totalConversions: 0,
        totalSpent: 0
      })
    } catch (error) {
      console.error('Error creating user profile:', error)
      setDemoUser()
    }
  }

  const addPaper = (paper) => {
    setPapers(prev => [paper, ...prev])
  }

  const updatePaper = (id, updates) => {
    setPapers(prev => prev.map(paper => 
      paper.id === id ? { ...paper, ...updates } : paper
    ))
  }

  const createCollection = (collection) => {
    const newCollection = {
      ...collection,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setCollections(prev => [newCollection, ...prev])
    return newCollection
  }

  const value = {
    user,
    setUser,
    papers,
    setPapers,
    collections,
    setCollections,
    isLoading,
    setIsLoading,
    error,
    setError,
    addPaper,
    updatePaper,
    createCollection,
    toast
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      <toast.ToastContainer />
    </AppContext.Provider>
  )
}