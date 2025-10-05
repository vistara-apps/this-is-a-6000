import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow focus:ring-primary',
    secondary: 'bg-surface border border-border text-text hover:bg-surface-hover hover:border-primary/30 focus:ring-primary',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-text hover:bg-surface-hover focus:ring-primary',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={`
        inline-flex items-center justify-center space-x-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg
        transform hover:scale-105 active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  )
}

export default Button