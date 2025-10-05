import React, { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const ErrorNotification = () => {
  const { error, setError } = useApp()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000) // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [error, setError])

  if (!error) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-surface border border-error rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-error mb-1">Error</h4>
            <p className="text-sm text-text-muted">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-surface-hover rounded transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>
    </div>
  )
}