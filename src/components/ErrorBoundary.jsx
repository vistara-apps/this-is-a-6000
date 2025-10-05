import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text">Something went wrong</h1>
              <p className="text-text-muted">
                We encountered an unexpected error. Please try refreshing the page or return to home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center space-x-2 bg-surface border border-border text-text px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-surface border border-border rounded-lg p-4 text-sm">
                <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                <pre className="text-error text-xs overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary