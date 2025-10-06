import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Please check your environment variables.')
}

export const stripePromise = loadStripe(stripePublishableKey || '')

// Payment configuration
export const PAPER_ANALYSIS_PRICE = 500 // $5.00 in cents
export const CURRENCY = 'usd'

// Stripe payment methods
export const createPaymentIntent = async (amount, currency = CURRENCY, metadata = {}) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        metadata
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export const confirmPayment = async (stripe, clientSecret, paymentMethod) => {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return result.paymentIntent
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw error
  }
}