import { supabase, TABLES, PAYMENT_STATUS, SUBSCRIPTION_TIERS } from '../config/supabase'

class PaymentService {
  constructor() {
    this.x402PricePerPaper = 5.00 // $5 per paper after the first free one
  }

  // Check if user can convert a paper (first one free, then $5 each)
  async canUserConvertPaper(userId) {
    try {
      // Get user's usage count for current month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usageData, error: usageError } = await supabase
        .from(TABLES.USAGE_LOGS)
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (usageError) throw usageError

      const monthlyUsage = usageData?.length || 0

      // Get user's subscription info
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('subscription_tier, monthly_conversions_limit')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      const subscriptionTier = userData?.subscription_tier || SUBSCRIPTION_TIERS.FREE
      const monthlyLimit = userData?.monthly_conversions_limit || (subscriptionTier === SUBSCRIPTION_TIERS.FREE ? 1 : 999)

      // Free users get 1 free conversion per month
      if (subscriptionTier === SUBSCRIPTION_TIERS.FREE) {
        return {
          canConvert: monthlyUsage < 1,
          isFirstFree: monthlyUsage === 0,
          requiresPayment: monthlyUsage >= 1,
          monthlyUsage,
          monthlyLimit: 1,
          costPerPaper: this.x402PricePerPaper
        }
      }

      // Premium users have higher limits
      return {
        canConvert: monthlyUsage < monthlyLimit,
        isFirstFree: false,
        requiresPayment: false,
        monthlyUsage,
        monthlyLimit,
        costPerPaper: 0
      }
    } catch (error) {
      console.error('Error checking user conversion eligibility:', error)
      throw new Error('Failed to check conversion eligibility')
    }
  }

  // Create a payment record for x402 payment
  async createPayment(userId, paperUrl, amount = null) {
    try {
      const paymentAmount = amount || this.x402PricePerPaper

      const { data, error } = await supabase
        .from(TABLES.PAYMENTS)
        .insert({
          user_id: userId,
          amount: paymentAmount,
          currency: 'USD',
          status: PAYMENT_STATUS.PENDING,
          paper_url: paperUrl,
          payment_method: 'x402',
          metadata: {
            service: 'paper_conversion',
            paper_url: paperUrl,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error creating payment:', error)
      throw new Error('Failed to create payment record')
    }
  }

  // Process x402 payment (simplified - in real implementation this would integrate with x402 protocol)
  async processX402Payment(paymentId, paymentDetails) {
    try {
      // In a real implementation, this would:
      // 1. Validate the x402 payment headers
      // 2. Process the micropayment through x402 protocol
      // 3. Verify payment completion
      
      // For now, we'll simulate the payment process
      const isPaymentSuccessful = await this.simulateX402Payment(paymentDetails)

      const newStatus = isPaymentSuccessful ? PAYMENT_STATUS.COMPLETED : PAYMENT_STATUS.FAILED

      const { data, error } = await supabase
        .from(TABLES.PAYMENTS)
        .update({
          status: newStatus,
          processed_at: new Date().toISOString(),
          transaction_id: `x402_${Date.now()}`,
          metadata: {
            ...paymentDetails,
            processed_at: new Date().toISOString()
          }
        })
        .eq('id', paymentId)
        .select()
        .single()

      if (error) throw error

      return {
        success: isPaymentSuccessful,
        payment: data
      }
    } catch (error) {
      console.error('Error processing x402 payment:', error)
      throw new Error('Failed to process payment')
    }
  }

  // Simulate x402 payment (replace with real x402 integration)
  async simulateX402Payment(paymentDetails) {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate 95% success rate
    return Math.random() > 0.05
  }

  // Log paper conversion usage
  async logPaperConversion(userId, paperId, paperUrl, wasPaymentRequired = false, paymentId = null) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USAGE_LOGS)
        .insert({
          user_id: userId,
          paper_id: paperId,
          paper_url: paperUrl,
          action_type: 'paper_conversion',
          was_payment_required: wasPaymentRequired,
          payment_id: paymentId,
          metadata: {
            timestamp: new Date().toISOString(),
            paper_url: paperUrl,
            payment_required: wasPaymentRequired
          }
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error logging paper conversion:', error)
      throw new Error('Failed to log usage')
    }
  }

  // Get user's payment history
  async getUserPayments(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PAYMENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching user payments:', error)
      throw new Error('Failed to fetch payment history')
    }
  }

  // Get user's usage statistics
  async getUserUsageStats(userId) {
    try {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: monthlyUsage, error: monthlyError } = await supabase
        .from(TABLES.USAGE_LOGS)
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (monthlyError) throw monthlyError

      const { data: totalUsage, error: totalError } = await supabase
        .from(TABLES.USAGE_LOGS)
        .select('*')
        .eq('user_id', userId)

      if (totalError) throw totalError

      const { data: totalSpent, error: spentError } = await supabase
        .from(TABLES.PAYMENTS)
        .select('amount')
        .eq('user_id', userId)
        .eq('status', PAYMENT_STATUS.COMPLETED)

      if (spentError) throw spentError

      const totalAmount = totalSpent?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0

      return {
        monthlyConversions: monthlyUsage?.length || 0,
        totalConversions: totalUsage?.length || 0,
        totalSpent: totalAmount,
        averageCostPerPaper: totalUsage?.length > 0 ? totalAmount / totalUsage.length : 0
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      throw new Error('Failed to fetch usage statistics')
    }
  }
}

export const paymentService = new PaymentService()