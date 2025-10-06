import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { paymentService } from '../services/paymentService'

export const PaymentInfo = () => {
  const { user } = useApp()
  const [payments, setPayments] = useState([])
  const [usageStats, setUsageStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user && !user.isDemo) {
      loadPaymentData()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadPaymentData = async () => {
    try {
      setLoading(true)
      const [paymentsData, statsData] = await Promise.all([
        paymentService.getUserPayments(user.id),
        paymentService.getUserUsageStats(user.id)
      ])
      
      setPayments(paymentsData)
      setUsageStats(statsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-error" />
      default:
        return <Clock className="w-4 h-4 text-text-muted" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-hover rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-surface-hover rounded"></div>
            <div className="h-4 bg-surface-hover rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center space-x-2 text-error">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading payment information: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Usage Statistics */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span>Usage Statistics</span>
        </h3>
        
        {user?.isDemo ? (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-primary mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Demo Mode</span>
            </div>
            <p className="text-sm text-text-muted">
              You're using PaperForge in demo mode. Sign up to track your usage and enable payments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">This Month</span>
              </div>
              <div className="text-2xl font-bold">
                {usageStats?.monthlyConversions || 0}
              </div>
              <div className="text-xs text-text-muted">
                papers converted
              </div>
            </div>
            
            <div className="bg-bg border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold">
                {usageStats?.totalConversions || 0}
              </div>
              <div className="text-xs text-text-muted">
                all time conversions
              </div>
            </div>
            
            <div className="bg-bg border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Total Spent</span>
              </div>
              <div className="text-2xl font-bold">
                ${(usageStats?.totalSpent || 0).toFixed(2)}
              </div>
              <div className="text-xs text-text-muted">
                on paper conversions
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      {!user?.isDemo && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Payment History</span>
          </h3>
          
          {payments.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No payments yet</p>
              <p className="text-sm">Your first paper conversion is free!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div 
                  key={payment.id} 
                  className="bg-bg border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="font-medium">
                        Paper Conversion - ${payment.amount}
                      </div>
                      <div className="text-sm text-text-muted">
                        {formatDate(payment.created_at)}
                      </div>
                      {payment.paper_url && (
                        <div className="text-xs text-text-muted truncate max-w-xs">
                          {payment.paper_url}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium capitalize ${
                      payment.status === 'completed' ? 'text-success' :
                      payment.status === 'pending' ? 'text-warning' :
                      payment.status === 'failed' ? 'text-error' :
                      'text-text-muted'
                    }`}>
                      {payment.status}
                    </div>
                    {payment.transaction_id && (
                      <div className="text-xs text-text-muted">
                        {payment.transaction_id}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pricing Information */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <span>Pricing</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>First paper conversion</span>
            <span className="font-medium text-success">Free</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>Additional papers</span>
            <span className="font-medium">$5.00 each</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Payment method</span>
            <span className="font-medium">x402 micropayments</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="text-sm text-primary">
            <strong>x402 Protocol:</strong> Seamless micropayments for research paper analysis. 
            Pay only for what you use with instant, low-fee transactions.
          </div>
        </div>
      </div>
    </div>
  )
}