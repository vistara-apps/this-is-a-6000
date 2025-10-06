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
        // Check if user is authenticated - handle potential AuthSessionMissingError
        let authUser = null
        try {
          const { data: { user }, error } = await supabase.auth.getUser()
          if (!error && user) {
            authUser = user
          }
        } catch (authError) {
          console.log('No active auth session, using demo mode:', authError.message)
          // Don't throw error, just continue with demo user
        }

        if (authUser) {
          // Get user profile from database
          const { data: profile, error: profileError } = await supabase
            .from('paperforge_users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (profileError) {
            console.error('Profile fetch error:', profileError)
            // Create new user profile
            await createUserProfile(authUser)
          } else {
            // Get usage stats
            const usageStats = await paymentService.getUserUsageStats(authUser.id)
            
            setUser({
              ...profile,
              monthlyConversionsUsed: usageStats.monthlyConversions,
              totalConversions: usageStats.totalConversions,
              totalSpent: usageStats.totalSpent
            })
          }
        } else {
          // No authenticated user, use demo user
          setDemoUser()
        }
      } catch (error) {
        console.error('User initialization error:', error)
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

      if (error) throw error

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