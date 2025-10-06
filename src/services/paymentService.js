import { stripePromise, PAPER_ANALYSIS_PRICE } from '../lib/stripe'
import { databaseService } from './databaseService'
import { supabase } from '../lib/supabase'

export const paymentService = {
  // Check if user can analyze papers for free
  async canAnalyzeForFree(userId) {
    try {
      const profile = await databaseService.getUserProfile(userId)
      return (profile?.papers_analyzed || 0) === 0
    } catch (error) {
      console.error('Error checking free analysis eligibility:', error)
      return false
    }
  },

  // Get user's analysis count and payment history
  async getUserAnalysisInfo(userId) {
    try {
      const [profile, stats] = await Promise.all([
        databaseService.getUserProfile(userId),
        databaseService.getUserStats(userId)
      ])
      
      return {
        papersAnalyzed: profile?.papers_analyzed || 0,
        canAnalyzeForFree: (profile?.papers_analyzed || 0) === 0,
        totalSpent: stats.totalSpent || 0,
        successfulPayments: stats.successfulPayments || 0
      }
    } catch (error) {
      console.error('Error fetching user analysis info:', error)
      return {
        papersAnalyzed: 0,
        canAnalyzeForFree: true,
        totalSpent: 0,
        successfulPayments: 0
      }
    }
  },

  // Create payment intent for paper analysis
  async createPaymentIntent(userId, paperInfo) {
    try {
      // Check if user needs to pay
      const canAnalyzeForFree = await this.canAnalyzeForFree(userId)
      
      if (canAnalyzeForFree) {
        return {
          requiresPayment: false,
          isFreeAnalysis: true,
          message: 'First analysis is free!'
        }
      }

      // Create Stripe payment intent via your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: PAPER_ANALYSIS_PRICE,
          currency: 'usd',
          metadata: {
            userId,
            paperTitle: paperInfo.title || 'Research Paper Analysis',
            paperSource: paperInfo.source || 'unknown'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const paymentIntent = await response.json()

      // Save payment record to database
      await databaseService.createPayment(
        userId,
        null, // paperId will be set after paper is created
        paymentIntent.id,
        PAPER_ANALYSIS_PRICE
      )

      return {
        requiresPayment: true,
        isFreeAnalysis: false,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: PAPER_ANALYSIS_PRICE,
        currency: 'usd'
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error('Failed to initialize payment. Please try again.')
    }
  },

  // Process payment and analyze paper
  async processPaymentAndAnalyze(paymentIntentId, paymentMethodId, paperInput, inputType, userId) {
    try {
      const stripe = await stripePromise
      
      if (!stripe) {
        throw new Error('Stripe not loaded')
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
        payment_method: paymentMethodId
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not successful')
      }

      // Update payment status in database
      await databaseService.updatePaymentStatus(paymentIntentId, 'succeeded')

      // Process the paper with payment info
      const { paperService } = await import('./paperService')
      const result = await paperService.processPaper(
        paperInput, 
        inputType, 
        userId, 
        paymentIntentId
      )

      return {
        success: true,
        paper: result,
        paymentIntent
      }
    } catch (error) {
      console.error('Error processing payment and analysis:', error)
      
      // Update payment status to failed
      try {
        await databaseService.updatePaymentStatus(paymentIntentId, 'failed')
      } catch (dbError) {
        console.error('Error updating payment status:', dbError)
      }
      
      throw error
    }
  },

  // Process free analysis (first paper)
  async processFreeAnalysis(paperInput, inputType, userId) {
    try {
      const canAnalyzeForFree = await this.canAnalyzeForFree(userId)
      
      if (!canAnalyzeForFree) {
        throw new Error('Free analysis not available. Payment required.')
      }

      // Process the paper without payment
      const { paperService } = await import('./paperService')
      const result = await paperService.processPaper(
        paperInput, 
        inputType, 
        userId, 
        null // no payment intent for free analysis
      )

      return {
        success: true,
        paper: result,
        isFreeAnalysis: true
      }
    } catch (error) {
      console.error('Error processing free analysis:', error)
      throw error
    }
  },

  // Get payment history for user
  async getPaymentHistory(userId) {
    try {
      return await databaseService.getUserPayments(userId)
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  },

  // Refund a payment (admin function)
  async refundPayment(paymentIntentId, reason = 'requested_by_customer') {
    try {
      const response = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          reason
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process refund')
      }

      const refund = await response.json()

      // Update payment status in database
      await databaseService.updatePaymentStatus(paymentIntentId, 'refunded')

      return refund
    } catch (error) {
      console.error('Error processing refund:', error)
      throw error
    }
  }
}