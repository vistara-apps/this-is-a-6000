import React, { useState } from 'react'
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
  User,
  LogOut,
  CreditCard
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AuthModal } from './AuthModal'

export const Navigation = () => {
  const location = useLocation()
  const { user, userUsage, signOut } = useApp()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

  const navItems = [
    { path: '/', label: 'Home', icon: FileText },
    { path: '/architecture-finder', label: 'Find Architecture', icon: Search },
    { path: '/benchmarking', label: 'Benchmarking', icon: BarChart3 },
    { path: '/collections', label: 'Collections', icon: FolderOpen },
  ]

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white group-hover:animate-bounce" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-text to-primary bg-clip-text text-transparent">PaperForge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {userUsage && (
                  <div className="text-sm text-text-muted">
                    {userUsage.freeConversionsUsed}/1 free • {userUsage.paidConversionsUsed} paid
                  </div>
                )}
                
                {user.profile?.subscription_tier === 'free' && (
                  <Link
                    to="/pricing"
                    className="flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade</span>
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Sign Up
                </button>
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
          <div className="md:hidden border-t border-border animate-slide-in">
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
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </nav>
  )
}