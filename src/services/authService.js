import { supabase, TABLES, SUBSCRIPTION_TIERS } from '../lib/supabase'

export class AuthService {
  // Sign up new user
  static async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            subscription_tier: SUBSCRIPTION_TIERS.FREE,
            ...userData
          }
        }
      })
      
      if (error) throw error
      
      // Create user profile in our users table
      if (data.user) {
        await this.createUserProfile(data.user)
      }
      
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw new Error(error.message || 'Failed to create account')
    }
  }

  // Sign in user
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign in error:', error)
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw new Error('Failed to sign out')
    }
  }

  // Get current session
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      if (user) {
        // Get full user profile from our users table
        const profile = await this.getUserProfile(user.id)
        return { ...user, profile }
      }
      
      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Create user profile in our database
  static async createUserProfile(user) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          subscription_tier: SUBSCRIPTION_TIERS.FREE,
          monthly_conversions_limit: 3, // Free tier limit
          monthly_conversions_used: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Create user profile error:', error)
      throw error
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Update user profile error:', error)
      throw error
    }
  }

  // Listen to auth changes
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Reset password
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Reset password error:', error)
      throw new Error('Failed to send reset password email')
    }
  }

  // Update password
  static async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Update password error:', error)
      throw new Error('Failed to update password')
    }
  }
}

export default AuthService