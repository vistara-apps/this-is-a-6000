import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import { useAuth } from './AuthContext'
import { paperService } from '../services/paperService'
import { paymentService } from '../services/paymentService'
import { databaseService } from '../services/databaseService'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const { user, profile, isAuthenticated } = useAuth()
  const [papers, setPapers] = useState([])
  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysisInfo, setAnalysisInfo] = useState(null)
  const toast = useToast()

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData()
    } else {
      // Clear data when not authenticated
      setPapers([])
      setCollections([])
      setAnalysisInfo(null)
    }
  }, [isAuthenticated, user])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      const [userPapers, userCollections, userAnalysisInfo] = await Promise.all([
        paperService.getUserPapers(user.id),
        databaseService.getUserCollections(user.id),
        paymentService.getUserAnalysisInfo(user.id)
      ])
      
      setPapers(userPapers)
      setCollections(userCollections)
      setAnalysisInfo(userAnalysisInfo)
    } catch (err) {
      console.error('Error loading user data:', err)
      setError(err.message)
      toast.error('Failed to load your data')
    } finally {
      setIsLoading(false)
    }
  }

  const addPaper = (paper) => {
    setPapers(prev => [paper, ...prev])
    
    // Update analysis info
    if (analysisInfo) {
      setAnalysisInfo(prev => ({
        ...prev,
        papersAnalyzed: prev.papersAnalyzed + 1,
        canAnalyzeForFree: false // After first paper, no more free analyses
      }))
    }
  }

  const updatePaper = (id, updates) => {
    setPapers(prev => prev.map(paper => 
      paper.id === id ? { ...paper, ...updates } : paper
    ))
  }

  const createCollection = async (name, description = '') => {
    try {
      if (!isAuthenticated) {
        throw new Error('Please sign in to create collections')
      }
      
      const newCollection = await databaseService.createCollection(user.id, name, description)
      setCollections(prev => [newCollection, ...prev])
      toast.success('Collection created successfully')
      return newCollection
    } catch (err) {
      console.error('Error creating collection:', err)
      toast.error(err.message)
      throw err
    }
  }

  const addPaperToCollection = async (collectionId, paperId) => {
    try {
      await databaseService.addPaperToCollection(collectionId, paperId)
      
      // Update local state
      setCollections(prev => prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, paper_ids: [...(collection.paper_ids || []), paperId] }
          : collection
      ))
      
      toast.success('Paper added to collection')
    } catch (err) {
      console.error('Error adding paper to collection:', err)
      toast.error(err.message)
    }
  }

  const refreshUserData = async () => {
    if (isAuthenticated) {
      await loadUserData()
    }
  }

  // Check if user can analyze papers for free
  const canAnalyzeForFree = analysisInfo?.canAnalyzeForFree || false
  
  // Get effective user object (combines auth user and profile)
  const effectiveUser = isAuthenticated ? {
    id: user.id,
    email: user.email,
    fullName: profile?.full_name || user.user_metadata?.full_name || '',
    subscriptionTier: profile?.subscription_tier || 'free',
    papersAnalyzed: profile?.papers_analyzed || 0,
    monthlyConversionsUsed: profile?.papers_analyzed || 0,
    monthlyConversionsLimit: canAnalyzeForFree ? 1 : 999, // Simplified: after first free, unlimited with payment
    researchInterests: profile?.research_interests || [],
    preferredFrameworks: profile?.preferred_frameworks || ['PyTorch', 'TensorFlow'],
    ...analysisInfo
  } : null

  const value = {
    user: effectiveUser,
    isAuthenticated,
    papers,
    setPapers,
    collections,
    setCollections,
    isLoading,
    setIsLoading,
    error,
    setError,
    analysisInfo,
    addPaper,
    updatePaper,
    createCollection,
    addPaperToCollection,
    refreshUserData,
    loadUserData,
    canAnalyzeForFree,
    toast
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      <toast.ToastContainer />
    </AppContext.Provider>
  )
}