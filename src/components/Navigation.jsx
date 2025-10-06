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
  Settings
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from './AuthModal'

export const Navigation = () => {
  const location = useLocation()
  const { user, isAuthenticated } = useApp()
  const { signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: FileText },
    { path: '/architecture-finder', label: 'Find Architecture', icon: Search },
    { path: '/benchmarking', label: 'Benchmarking', icon: BarChart3 },
    { path: '/collections', label: 'Collections', icon: FolderOpen },
  ]

  const isActive = (path) => location.pathname === path

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
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-text-muted">
                  {user?.papersAnalyzed || 0} papers analyzed
                </div>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user?.fullName || user?.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/pricing"
                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-surface-hover transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Crown className="w-4 h-4" />
                        <span>Upgrade Plan</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-text-muted hover:text-text transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  Get Started
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
              
              {/* Mobile Auth Section */}
              <div className="border-t border-border pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user?.fullName || user?.email}</p>
                      <p className="text-xs text-text-muted">{user?.papersAnalyzed || 0} papers analyzed</p>
                    </div>
                    <Link
                      to="/pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-surface-hover"
                    >
                      <Crown className="w-5 h-5" />
                      <span>Upgrade Plan</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-error hover:bg-error/10 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-surface-hover w-full"
                    >
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium bg-primary text-white w-full"
                    >
                      <User className="w-5 h-5" />
                      <span>Get Started</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </nav>
  )
}