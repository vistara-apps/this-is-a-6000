import React, { useState, useEffect } from 'react'
import { 
  X, 
  CreditCard, 
  Lock, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  DollarSign
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { paymentService } from '../services/paymentService'
import { stripePromise } from '../lib/stripe'

export const PaymentModal = ({ onClose, onSuccess, paperInfo, paperInput, inputType }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [cardElement, setCardElement] = useState(null)
  const [stripe, setStripe] = useState(null)

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true)
        
        // Load Stripe
        const stripeInstance = await stripePromise
        setStripe(stripeInstance)
        
        // Check payment requirements
        const paymentInfo = await paymentService.createPaymentIntent(user.id, paperInfo)
        setPaymentInfo(paymentInfo)
        
        // If it's a free analysis, we can process immediately
        if (!paymentInfo.requiresPayment) {
          await processFreeAnalysis()
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      initializePayment()
    }
  }, [user])

  useEffect(() => {
    // Initialize Stripe Elements when payment is required
    if (stripe && paymentInfo?.requiresPayment) {
      const elements = stripe.elements()
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      })
      
      card.mount('#card-element')
      setCardElement(card)
      
      return () => {
        card.destroy()
      }
    }
  }, [stripe, paymentInfo])

  const processFreeAnalysis = async () => {
    try {
      setProcessingPayment(true)
      
      const result = await paymentService.processFreeAnalysis(
        paperInput,
        inputType,
        user.id
      )
      
      onSuccess(result.paper, { isFreeAnalysis: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handlePayment = async () => {
    if (!stripe || !cardElement || !paymentInfo?.clientSecret) {
      setError('Payment system not ready. Please try again.')
      return
    }

    try {
      setProcessingPayment(true)
      setError(null)

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message)
      }

      // Process payment and analyze paper
      const result = await paymentService.processPaymentAndAnalyze(
        paymentInfo.paymentIntentId,
        paymentMethod.id,
        paperInput,
        inputType,
        user.id
      )

      onSuccess(result.paper, { 
        paymentIntent: result.paymentIntent,
        isFreeAnalysis: false 
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-muted">Initializing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-xl max-w-lg w-full shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">
              {paymentInfo?.isFreeAnalysis ? 'Free Analysis' : 'Paper Analysis Payment'}
            </h2>
            <p className="text-sm text-text-muted">
              {paymentInfo?.isFreeAnalysis 
                ? 'Your first analysis is free!' 
                : 'Secure payment powered by Stripe'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Paper Info */}
          <div className="bg-bg border border-border rounded-lg p-4">
            <h3 className="font-medium mb-2">Paper to Analyze</h3>
            <p className="text-sm text-text-muted">
              {paperInfo?.title || 'Research Paper Analysis'}
            </p>
            {paperInfo?.source && (
              <p className="text-xs text-text-muted mt-1">
                Source: {paperInfo.source.toUpperCase()}
              </p>
            )}
          </div>

          {/* Pricing Info */}
          {paymentInfo?.isFreeAnalysis ? (
            <div className="bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium text-success">First Analysis Free!</span>
              </div>
              <p className="text-sm text-text-muted">
                Enjoy your complimentary AI-powered paper analysis. Future analyses will be $5 each.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-medium">AI Paper Analysis</span>
                </div>
                <span className="text-2xl font-bold text-primary">$5.00</span>
              </div>
              <p className="text-sm text-text-muted">
                Includes AI-powered summary, code generation, and insights
              </p>
            </div>
          )}

          {/* Payment Form */}
          {paymentInfo?.requiresPayment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Information</label>
                <div className="border border-border rounded-lg p-3 bg-bg">
                  <div id="card-element">
                    {/* Stripe Elements will mount here */}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-text-muted">
                  <Lock className="w-3 h-3" />
                  <span>Secured by Stripe. Your payment information is encrypted.</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={paymentInfo?.isFreeAnalysis ? processFreeAnalysis : handlePayment}
            disabled={processingPayment}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {processingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {paymentInfo?.isFreeAnalysis ? 'Processing Analysis...' : 'Processing Payment...'}
                </span>
              </>
            ) : (
              <>
                {paymentInfo?.isFreeAnalysis ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Start Free Analysis</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay $5.00 & Analyze</span>
                  </>
                )}
              </>
            )}
          </button>

          {/* Features List */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium mb-3">What you'll get:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>AI-generated summary and insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Production-ready code templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Implementation complexity assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Saved to your personal library</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}