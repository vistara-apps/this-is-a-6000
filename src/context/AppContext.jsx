import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../components/Toast'

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

  // Mock user for demo
  useEffect(() => {
    setUser({
      id: '1',
      email: 'demo@paperforge.ai',
      subscriptionTier: 'free',
      monthlyConversionsUsed: 2,
      monthlyConversionsLimit: 3,
      researchInterests: ['Computer Vision', 'NLP'],
      preferredFrameworks: ['PyTorch', 'TensorFlow']
    })
  }, [])

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