import React from 'react'

export const FeatureCard = ({ icon: Icon, title, description, stats, color }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/10', 
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10'
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:bg-surface-hover hover:border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:scale-105">
      <div className="space-y-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="w-6 h-6 group-hover:animate-bounce" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-text-muted text-sm leading-relaxed group-hover:text-text transition-colors">{description}</p>
        </div>
        
        <div className={`text-sm font-medium ${colorClasses[color].split(' ')[0]} bg-transparent flex items-center space-x-1`}>
          <span>{stats}</span>
          <div className="w-1 h-1 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}