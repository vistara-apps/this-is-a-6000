// This is a simulation file for API endpoints
// In production, these would be actual backend endpoints

// Simulate Stripe payment intent creation
window.createPaymentIntent = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: 'pi_' + Math.random().toString(36).substr(2, 9),
    client_secret: 'pi_' + Math.random().toString(36).substr(2, 9) + '_secret_' + Math.random().toString(36).substr(2, 9),
    amount: data.amount,
    currency: data.currency,
    status: 'requires_payment_method'
  }
}

// Simulate payment confirmation
window.confirmPayment = async (paymentIntentId) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    id: paymentIntentId,
    status: 'succeeded',
    amount_received: 500
  }
}

// Override fetch for API endpoints
const originalFetch = window.fetch
window.fetch = async (url, options) => {
  // Intercept API calls
  if (url === '/api/create-payment-intent') {
    const data = JSON.parse(options.body)
    return {
      ok: true,
      json: () => window.createPaymentIntent(data)
    }
  }
  
  if (url === '/api/confirm-payment') {
    const data = JSON.parse(options.body)
    return {
      ok: true,
      json: () => window.confirmPayment(data.paymentIntentId)
    }
  }
  
  // For other requests, use original fetch
  return originalFetch(url, options)
}