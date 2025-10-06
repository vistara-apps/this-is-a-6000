import { supabase, TABLES, PAYMENT_STATUS, SUBSCRIPTION_TIERS } from '../config/supabase'

class PaymentService {
  constructor() {
    this.x402PricePerPaper = 5.00 // $5 per paper after the first free one
  }

  // Check if user can convert a paper (first one free, then $5 each)
  async canUserConvertPaper(userId) {
    try {
      // Handle demo user case
      if (userId === 'demo-user-1' || !userId) {
        return {
          canConvert: true,
          isFirstFree: true,
          requiresPayment: false,
          monthlyUsage: 0,
          monthlyLimit: 1,
          costPerPaper: this.x402PricePerPaper
        }
      }

      // Get user's usage count for current month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usageData, error: usageError } = await supabase
        .from(TABLES.USAGE_LOGS)
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (usageError) {
        console.error('Usage data error:', usageError)
        // If we can't access usage data, assume demo mode
        return {
          canConvert: true,
          isFirstFree: true,
          requiresPayment: false,
          monthlyUsage: 0,
          monthlyLimit: 1,
          costPerPaper: this.x402PricePerPaper
        }
      }

      const monthlyUsage = usageData?.length || 0

      // Get user's subscription info
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('subscription_tier, monthly_conversions_limit')
        .eq('id', userId)
        .single()

      if (userError) {
        console.error('User data error:', userError)
        // If we can't access user data, assume free tier
        return {
          canConvert: monthlyUsage < 1,
          isFirstFree: monthlyUsage === 0,
          requiresPayment: monthlyUsage >= 1,
          monthlyUsage,
          monthlyLimit: 1,
          costPerPaper: this.x402PricePerPaper
        }
      }

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
      // Return safe defaults for demo mode
      return {
        canConvert: true,
        isFirstFree: true,
        requiresPayment: false,
        monthlyUsage: 0,
        monthlyLimit: 1,
        costPerPaper: this.x402PricePerPaper
      }
    }
  }

  // Create a payment record for x402 payment
  async createPayment(userId, paperUrl, amount = null) {
    try {
      // Skip payment creation for demo users
      if (userId === 'demo-user-1' || !userId) {
        console.log('Skipping payment creation for demo user')
        return { 
          id: 'demo-payment', 
          demo: true, 
          amount: amount || this.x402PricePerPaper,
          status: PAYMENT_STATUS.COMPLETED 
        }
      }

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

      if (error) {
        console.error('Error creating payment:', error)
        // Return a fallback payment record instead of throwing
        return { 
          id: 'failed-payment', 
          error: error.message,
          amount: paymentAmount,
          status: PAYMENT_STATUS.FAILED 
        }
      }

      return data
    } catch (error) {
      console.error('Error creating payment:', error)
      // Return a fallback payment record instead of throwing
      return { 
        id: 'failed-payment', 
        error: error.message,
        amount: amount || this.x402PricePerPaper,
        status: PAYMENT_STATUS.FAILED 
      }
    }
  }

  // Process x402 payment (simplified - in real implementation this would integrate with x402 protocol)
  async processX402Payment(paymentId, paymentDetails) {
    try {
      // Handle demo payments
      if (paymentId === 'demo-payment' || !paymentId) {
        console.log('Processing demo payment')
        return {
          success: true,
          payment: { 
            id: 'demo-payment', 
            status: PAYMENT_STATUS.COMPLETED,
            demo: true 
          }
        }
      }

      // Handle failed payments
      if (paymentId === 'failed-payment') {
        return {
          success: false,
          payment: { 
            id: 'failed-payment', 
            status: PAYMENT_STATUS.FAILED,
            error: 'Payment creation failed' 
          }
        }
      }

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

      if (error) {
        console.error('Error processing x402 payment:', error)
        // Return failure instead of throwing
        return {
          success: false,
          payment: { 
            id: paymentId, 
            status: PAYMENT_STATUS.FAILED,
            error: error.message 
          }
        }
      }

      return {
        success: isPaymentSuccessful,
        payment: data
      }
    } catch (error) {
      console.error('Error processing x402 payment:', error)
      // Return failure instead of throwing
      return {
        success: false,
        payment: { 
          id: paymentId, 
          status: PAYMENT_STATUS.FAILED,
          error: error.message 
        }
      }
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
      // Skip logging for demo users
      if (userId === 'demo-user-1' || !userId) {
        console.log('Skipping usage logging for demo user')
        return { id: 'demo-log', demo: true }
      }

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

      if (error) {
        console.error('Error logging paper conversion:', error)
        // Don't throw error for logging failures, just log and continue
        return { id: 'failed-log', error: error.message }
      }

      return data
    } catch (error) {
      console.error('Error logging paper conversion:', error)
      // Return a safe fallback instead of throwing
      return { id: 'failed-log', error: error.message }
    }
  }

  // Get user's payment history
  async getUserPayments(userId) {
    try {
      // Return empty array for demo users
      if (userId === 'demo-user-1' || !userId) {
        return []
      }

      const { data, error } = await supabase
        .from(TABLES.PAYMENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user payments:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user payments:', error)
      return []
    }
  }

  // Get user's usage statistics
  async getUserUsageStats(userId) {
    try {
      // Handle demo user case
      if (userId === 'demo-user-1' || !userId) {
        return {
          monthlyConversions: 0,
          totalConversions: 0,
          totalSpent: 0,
          averageCostPerPaper: 0
        }
      }

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: monthlyUsage, error: monthlyError } = await supabase
        .from(TABLES.USAGE_LOGS)
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (monthlyError) {
        console.error('Monthly usage error:', monthlyError)
        // Return default stats if we can't access the data
        return {
          monthlyConversions: 0,
          totalConversions: 0,
          totalSpent: 0,
          averageCostPerPaper: 0
        }
      }

      const { data: totalUsage, error: totalError } = await supabase
        .from(TABLES.USAGE_LOGS)
        .select('*')
        .eq('user_id', userId)

      if (totalError) {
        console.error('Total usage error:', totalError)
        // Return partial stats with monthly data only
        return {
          monthlyConversions: monthlyUsage?.length || 0,
          totalConversions: monthlyUsage?.length || 0,
          totalSpent: 0,
          averageCostPerPaper: 0
        }
      }

      const { data: totalSpent, error: spentError } = await supabase
        .from(TABLES.PAYMENTS)
        .select('amount')
        .eq('user_id', userId)
        .eq('status', PAYMENT_STATUS.COMPLETED)

      if (spentError) {
        console.error('Payment data error:', spentError)
        // Return stats without payment data
        return {
          monthlyConversions: monthlyUsage?.length || 0,
          totalConversions: totalUsage?.length || 0,
          totalSpent: 0,
          averageCostPerPaper: 0
        }
      }

      const totalAmount = totalSpent?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0

      return {
        monthlyConversions: monthlyUsage?.length || 0,
        totalConversions: totalUsage?.length || 0,
        totalSpent: totalAmount,
        averageCostPerPaper: totalUsage?.length > 0 ? totalAmount / totalUsage.length : 0
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      // Return safe defaults instead of throwing
      return {
        monthlyConversions: 0,
        totalConversions: 0,
        totalSpent: 0,
        averageCostPerPaper: 0
      }
    }
  }
}

export const paymentService = new PaymentService()