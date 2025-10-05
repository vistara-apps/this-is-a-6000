import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Search className="w-12 h-12 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-text">404</h1>
          <h2 className="text-xl font-semibold text-text">Page Not Found</h2>
          <p className="text-text-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 bg-surface border border-border text-text px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>
        </div>

        <div className="text-sm text-text-muted">
          Looking for something specific? Try our{' '}
          <button
            onClick={() => navigate('/architecture-finder')}
            className="text-primary hover:text-primary-hover underline"
          >
            Architecture Finder
          </button>
          {' '}or browse{' '}
          <button
            onClick={() => navigate('/collections')}
            className="text-primary hover:text-primary-hover underline"
          >
            Collections
          </button>
        </div>
      </div>
    </div>
  )
}