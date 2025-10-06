import { supabase, TABLES, PAYMENT_STATUS, SUBSCRIPTION_TIERS } from '../lib/supabase'

// X402 Payment System - First one free, $5 for additional papers
const PAPER_CONVERSION_PRICE = 5.00 // $5 per paper after the first free one

export class PaymentService {
  // Check if user has free conversion available
  static async checkFreeConversionAvailable(userId) {
    try {
      const { data: conversions, error } = await supabase
        .from(TABLES.PAPER_CONVERSIONS)
        .select('id')
        .eq('user_id', userId)
        .eq('is_free', true)
      
      if (error) throw error
      
      // User gets one free conversion
      return conversions.length === 0
    } catch (error) {
      console.error('Error checking free conversion:', error)
      return false
    }
  }

  // Get user's usage statistics
  static async getUserUsage(userId) {
    try {
      const { data: conversions, error } = await supabase
        .from(TABLES.PAPER_CONVERSIONS)
        .select('id, is_free, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      const monthlyConversions = conversions.filter(c => 
        c.created_at.startsWith(currentMonth)
      )
      
      const freeConversionsUsed = conversions.filter(c => c.is_free).length
      const paidConversionsUsed = conversions.filter(c => !c.is_free).length
      
      return {
        totalConversions: conversions.length,
        monthlyConversions: monthlyConversions.length,
        freeConversionsUsed,
        paidConversionsUsed,
        hasFreeConversionAvailable: freeConversionsUsed === 0
      }
    } catch (error) {
      console.error('Error getting user usage:', error)
      return {
        totalConversions: 0,
        monthlyConversions: 0,
        freeConversionsUsed: 0,
        paidConversionsUsed: 0,
        hasFreeConversionAvailable: true
      }
    }
  }

  // Create a payment record for paper conversion
  static async createPaymentRecord(userId, amount, paperData) {
    try {
      const { data: payment, error } = await supabase
        .from(TABLES.PAYMENTS)
        .insert({
          user_id: userId,
          amount: amount,
          currency: 'USD',
          status: PAYMENT_STATUS.PENDING,
          payment_type: 'paper_conversion',
          metadata: {
            paper_title: paperData.title,
            paper_id: paperData.id,
            paper_url: paperData.url
          }
        })
        .select()
        .single()
      
      if (error) throw error
      return payment
    } catch (error) {
      console.error('Error creating payment record:', error)
      throw new Error('Failed to create payment record')
    }
  }

  // Process paper conversion payment
  static async processPaperConversion(userId, paperData) {
    try {
      // Check if user has free conversion available
      const hasFreeConversion = await this.checkFreeConversionAvailable(userId)
      
      let paymentRecord = null
      const conversionData = {
        user_id: userId,
        paper_id: paperData.id,
        paper_title: paperData.title,
        paper_url: paperData.url,
        is_free: hasFreeConversion,
        amount_paid: hasFreeConversion ? 0 : PAPER_CONVERSION_PRICE,
        status: 'completed'
      }

      // If not free, create payment record
      if (!hasFreeConversion) {
        paymentRecord = await this.createPaymentRecord(userId, PAPER_CONVERSION_PRICE, paperData)
        conversionData.payment_id = paymentRecord.id
        
        // In a real implementation, you would integrate with a payment processor here
        // For demo purposes, we'll mark the payment as completed
        await supabase
          .from(TABLES.PAYMENTS)
          .update({ status: PAYMENT_STATUS.COMPLETED })
          .eq('id', paymentRecord.id)
      }

      // Record the conversion
      const { data: conversion, error } = await supabase
        .from(TABLES.PAPER_CONVERSIONS)
        .insert(conversionData)
        .select()
        .single()
      
      if (error) throw error

      // Log usage
      await this.logUsage(userId, 'paper_conversion', {
        paper_id: paperData.id,
        is_free: hasFreeConversion,
        amount: conversionData.amount_paid
      })

      return {
        success: true,
        conversion,
        payment: paymentRecord,
        isFree: hasFreeConversion,
        amount: conversionData.amount_paid
      }
    } catch (error) {
      console.error('Error processing paper conversion:', error)
      throw new Error('Failed to process payment for paper conversion')
    }
  }

  // Log usage for analytics
  static async logUsage(userId, action, metadata = {}) {
    try {
      await supabase
        .from(TABLES.USAGE_LOGS)
        .insert({
          user_id: userId,
          action,
          metadata,
          timestamp: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging usage:', error)
      // Don't throw error for logging failures
    }
  }

  // Get user's payment history
  static async getPaymentHistory(userId) {
    try {
      const { data: payments, error } = await supabase
        .from(TABLES.PAYMENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return payments || []
    } catch (error) {
      console.error('Error getting payment history:', error)
      return []
    }
  }

  // Simulate payment processing (in real app, integrate with Stripe/PayPal)
  static async processPayment(paymentId, paymentMethod) {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real implementation, call payment processor API here
      const success = Math.random() > 0.1 // 90% success rate for demo
      
      const status = success ? PAYMENT_STATUS.COMPLETED : PAYMENT_STATUS.FAILED
      
      const { data: payment, error } = await supabase
        .from(TABLES.PAYMENTS)
        .update({ 
          status,
          payment_method: paymentMethod,
          processed_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single()
      
      if (error) throw error
      
      return {
        success,
        payment,
        message: success ? 'Payment processed successfully' : 'Payment failed'
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      throw new Error('Payment processing failed')
    }
  }
}

export default PaymentService