import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [notifications, setNotifications] = useState([])

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

  const addNotification = (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      type: 'info',
      ...notification,
      timestamp: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
    
    return id
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearError = () => {
    setError(null)
  }

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [error])

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
    clearError,
    notifications,
    addNotification,
    removeNotification,
    addPaper,
    updatePaper,
    createCollection
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}