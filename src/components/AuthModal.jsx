import React, { useState } from 'react'
import { 
  X, 
  Mail, 
  Lock, 
  User,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const AuthModal = ({ onClose, initialMode = 'signin' }) => {
  const { signIn, signUp, resetPassword, loading, error } = useAuth()
  const [mode, setMode] = useState(initialMode) // 'signin', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [formError, setFormError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setFormError('')
  }

  const validateForm = () => {
    if (!formData.email) {
      setFormError('Email is required')
      return false
    }
    
    if (mode !== 'reset' && !formData.password) {
      setFormError('Password is required')
      return false
    }
    
    if (mode === 'signup') {
      if (!formData.fullName) {
        setFormError('Full name is required')
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match')
        return false
      }
      
      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters')
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        onClose()
      } else if (mode === 'signup') {
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName
        })
        onClose()
      } else if (mode === 'reset') {
        await resetPassword(formData.email)
        setResetSent(true)
      }
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-xl max-w-md w-full shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-sm text-text-muted">
              {mode === 'signin' && 'Welcome back to PaperForge'}
              {mode === 'signup' && 'Join PaperForge to save your analyses'}
              {mode === 'reset' && 'Enter your email to reset your password'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {resetSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Check your email</h3>
                <p className="text-sm text-text-muted">
                  We've sent a password reset link to {formData.email}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {(formError || error) && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
                    <p className="text-sm text-error">{formError || error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {mode === 'signin' && 'Signing in...'}
                      {mode === 'signup' && 'Creating account...'}
                      {mode === 'reset' && 'Sending reset link...'}
                    </span>
                  </>
                ) : (
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'reset' && 'Send Reset Link'}
                  </span>
                )}
              </button>

              <div className="text-center space-y-2">
                {mode === 'signin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-sm text-text-muted">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}

                {mode === 'signup' && (
                  <p className="text-sm text-text-muted">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}

                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}