import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { PaperAnalysisPage } from './pages/PaperAnalysisPage'
import { ArchitectureFinderPage } from './pages/ArchitectureFinderPage'
import { BenchmarkingPage } from './pages/BenchmarkingPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { PricingPage } from './pages/PricingPage'
import { AppProvider, useApp } from './context/AppContext'
import { AlertTriangle, X } from 'lucide-react'

const ErrorDisplay = () => {
  const { error, setError } = useApp()
  
  if (!error) return null
  
  return (
    <div className="fixed top-4 right-4 bg-error/10 border border-error text-error px-4 py-3 rounded-lg flex items-center space-x-3 z-50 max-w-md">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{error}</span>
      <button 
        onClick={() => setError(null)}
        className="hover:bg-error/20 p-1 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

const AppContent = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navigation />
      <ErrorDisplay />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paper/:id" element={<PaperAnalysisPage />} />
          <Route path="/architecture-finder" element={<ArchitectureFinderPage />} />
          <Route path="/benchmarking" element={<BenchmarkingPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App