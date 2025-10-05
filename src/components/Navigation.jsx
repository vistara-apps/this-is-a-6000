import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FileText, 
  Search, 
  BarChart3, 
  FolderOpen, 
  Crown, 
  Menu, 
  X,
  Zap,
  Bell
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { GlobalSearch } from './GlobalSearch'

export const Navigation = () => {
  const location = useLocation()
  const { user } = useApp()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: FileText },
    { path: '/architecture-finder', label: 'Find Architecture', icon: Search },
    { path: '/benchmarking', label: 'Benchmarking', icon: BarChart3 },
    { path: '/collections', label: 'Collections', icon: FolderOpen },
    { path: '/changelog', label: 'Paper Feed', icon: Bell },
  ]

  const isActive = (path) => location.pathname === path

  // Listen for Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PaperForge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
              <span className="hidden lg:inline text-xs bg-surface border border-border px-2 py-0.5 rounded">⌘K</span>
            </button>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-text-muted">
                  {user.monthlyConversionsUsed}/{user.monthlyConversionsLimit} conversions
                </div>
                {user.subscriptionTier === 'free' && (
                  <Link
                    to="/pricing"
                    className="flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(path)
                      ? 'text-primary bg-primary/10'
                      : 'text-text-muted hover:text-text hover:bg-surface-hover'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
              {user?.subscriptionTier === 'free' && (
                <Link
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                >
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Pro</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Global Search */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  )
}