import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import { AuthService } from '../services/authService'
import { PaymentService } from '../services/paymentService'
import { supabase } from '../lib/supabase'

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
  const [userUsage, setUserUsage] = useState(null)
  const [papers, setPapers] = useState([])
  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const toast = useToast()

  // Initialize auth and load user data
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        
        // Check for existing session
        const session = await AuthService.getSession()
        if (session?.user) {
          await loadUserData(session.user.id)
        } else {
          // For demo purposes, create a mock user if no session exists
          setUser({
            id: 'demo-user',
            email: 'demo@paperforge.ai',
            profile: {
              subscription_tier: 'free',
              monthly_conversions_limit: 3,
              monthly_conversions_used: 0,
              research_interests: ['Computer Vision', 'NLP'],
              preferred_frameworks: ['PyTorch', 'TensorFlow']
            }
          })
          setUserUsage({
            totalConversions: 0,
            monthlyConversions: 0,
            freeConversionsUsed: 0,
            paidConversionsUsed: 0,
            hasFreeConversionAvailable: true
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setError('Failed to initialize authentication')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserUsage(null)
          setPapers([])
          setCollections([])
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Load user data and usage statistics
  const loadUserData = async (userId) => {
    try {
      const [currentUser, usage] = await Promise.all([
        AuthService.getCurrentUser(),
        PaymentService.getUserUsage(userId)
      ])
      
      setUser(currentUser)
      setUserUsage(usage)
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load user data')
    }
  }

  // Refresh user usage statistics
  const refreshUserUsage = async () => {
    if (!user?.id) return
    
    try {
      const usage = await PaymentService.getUserUsage(user.id)
      setUserUsage(usage)
    } catch (error) {
      console.error('Error refreshing usage:', error)
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

  // Process paper conversion with payment
  const processPaperConversion = async (paperData) => {
    if (!user?.id) {
      throw new Error('User must be logged in to convert papers')
    }

    try {
      setIsLoading(true)
      
      // Process payment and conversion
      const result = await PaymentService.processPaperConversion(user.id, paperData)
      
      // Refresh usage statistics
      await refreshUserUsage()
      
      return result
    } catch (error) {
      console.error('Paper conversion error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Authentication methods
  const signUp = async (email, password, userData) => {
    try {
      setIsLoading(true)
      const result = await AuthService.signUp(email, password, userData)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setIsLoading(true)
      const result = await AuthService.signIn(email, password)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setUser(null)
      setUserUsage(null)
      setPapers([])
      setCollections([])
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const value = {
    user,
    setUser,
    userUsage,
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
    processPaperConversion,
    refreshUserUsage,
    signUp,
    signIn,
    signOut,
    toast
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      <toast.ToastContainer />
    </AppContext.Provider>
  )
}