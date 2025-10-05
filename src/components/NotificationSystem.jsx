import React from 'react'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const NotificationSystem = () => {
  const { notifications, removeNotification, error, clearError } = useApp()

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'warning': return AlertTriangle
      case 'error': return AlertCircle
      default: return Info
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-success/20 border-success text-success'
      case 'warning': return 'bg-warning/20 border-warning text-warning'
      case 'error': return 'bg-error/20 border-error text-error'
      default: return 'bg-primary/20 border-primary text-primary'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {/* Global Error */}
      {error && (
        <div className="bg-error/20 border border-error rounded-lg p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-error">Error</div>
              <div className="text-sm text-error/80">{error}</div>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-error/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-error" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type)
        const colors = getColors(notification.type)
        
        return (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 shadow-lg backdrop-blur-sm animate-slide-in ${colors}`}
          >
            <div className="flex items-start space-x-3">
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {notification.title && (
                  <div className="text-sm font-medium">{notification.title}</div>
                )}
                <div className="text-sm opacity-90">{notification.message}</div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-black/10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}