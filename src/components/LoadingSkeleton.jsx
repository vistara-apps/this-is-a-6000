import React from 'react'

export const LoadingSkeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 bg-surface-hover',
    text: 'h-3 bg-surface-hover',
    title: 'h-6 bg-surface-hover',
    card: 'h-32 bg-surface-hover',
    avatar: 'w-10 h-10 bg-surface-hover rounded-full',
    button: 'h-10 bg-surface-hover rounded-lg'
  }

  return (
    <div className={`animate-pulse rounded ${variants[variant]} ${className}`} />
  )
}

export const PaperCardSkeleton = () => (
  <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="title" className="w-3/4" />
        <LoadingSkeleton variant="text" className="w-1/2" />
      </div>
      <LoadingSkeleton variant="button" className="w-16" />
    </div>
    <LoadingSkeleton variant="text" className="w-full" />
    <LoadingSkeleton variant="text" className="w-4/5" />
    <div className="flex items-center justify-between">
      <LoadingSkeleton variant="text" className="w-24" />
      <LoadingSkeleton variant="text" className="w-16" />
    </div>
  </div>
)

export const FeatureCardSkeleton = () => (
  <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
    <LoadingSkeleton className="w-12 h-12 rounded-lg" />
    <div className="space-y-2">
      <LoadingSkeleton variant="title" className="w-2/3" />
      <LoadingSkeleton variant="text" className="w-full" />
      <LoadingSkeleton variant="text" className="w-4/5" />
    </div>
    <LoadingSkeleton variant="text" className="w-1/3" />
  </div>
)