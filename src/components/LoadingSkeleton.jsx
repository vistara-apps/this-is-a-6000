import React from 'react'

export const LoadingSkeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  count = 1,
  variant = 'default'
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-48 rounded-xl'
      case 'avatar':
        return 'w-10 h-10 rounded-full'
      case 'button':
        return 'h-10 rounded-lg'
      case 'text':
        return 'h-4 rounded'
      case 'title':
        return 'h-6 rounded'
      default:
        return 'rounded'
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`bg-surface-hover animate-pulse ${width} ${height} ${getVariantClasses()}`}
        />
      ))}
    </div>
  )
}

export const PaperCardSkeleton = () => (
  <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="title" width="w-3/4" />
        <LoadingSkeleton variant="text" width="w-1/2" />
      </div>
      <LoadingSkeleton variant="avatar" />
    </div>
    <LoadingSkeleton variant="text" count={3} />
    <div className="flex items-center space-x-4">
      <LoadingSkeleton width="w-16" height="h-6" />
      <LoadingSkeleton width="w-20" height="h-6" />
      <LoadingSkeleton width="w-24" height="h-6" />
    </div>
  </div>
)

export const CollectionCardSkeleton = () => (
  <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
    <div className="flex items-center space-x-2">
      <LoadingSkeleton variant="avatar" />
      <LoadingSkeleton variant="title" width="w-2/3" />
    </div>
    <LoadingSkeleton variant="text" count={2} />
    <div className="flex flex-wrap gap-1">
      <LoadingSkeleton width="w-16" height="h-6" />
      <LoadingSkeleton width="w-20" height="h-6" />
      <LoadingSkeleton width="w-18" height="h-6" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <LoadingSkeleton width="w-24" height="h-4" />
      <LoadingSkeleton width="w-20" height="h-4" />
    </div>
  </div>
)