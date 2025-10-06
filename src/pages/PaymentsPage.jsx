import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { PaymentInfo } from '../components/PaymentInfo'
import { useApp } from '../context/AppContext'

export const PaymentsPage = () => {
  const navigate = useNavigate()
  const { user } = useApp()

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-primary" />
              <span>Payments & Usage</span>
            </h1>
            <p className="text-text-muted mt-1">
              Track your paper conversions and manage payments
            </p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-surface border border-border rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{user.email}</h2>
                <p className="text-sm text-text-muted capitalize">
                  {user.subscription_tier || 'free'} plan
                  {user.isDemo && ' (Demo Mode)'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-muted">Monthly Limit</div>
                <div className="font-semibold">
                  {user.monthlyConversionsUsed || 0}/{user.monthly_conversions_limit || 1}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information Component */}
        <PaymentInfo />
      </div>
    </div>
  )
}