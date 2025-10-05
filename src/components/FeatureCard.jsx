import React from 'react'

export const FeatureCard = ({ icon: Icon, title, description, stats, color }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/10', 
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10'
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:bg-surface-hover transition-colors group">
      <div className="space-y-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-text-muted text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className={`text-sm font-medium ${colorClasses[color].split(' ')[0]} bg-transparent`}>
          {stats}
        </div>
      </div>
    </div>
  )
}