import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { PaperAnalysisPage } from './pages/PaperAnalysisPage'
import { ArchitectureFinderPage } from './pages/ArchitectureFinderPage'
import { BenchmarkingPage } from './pages/BenchmarkingPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { PricingPage } from './pages/PricingPage'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import { ErrorNotification } from './components/ErrorNotification'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-bg text-text">
          <Navigation />
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
          <ErrorNotification />
        </div>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App