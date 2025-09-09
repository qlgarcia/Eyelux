import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance

  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('Stripe not configured: missing STRIPE_SECRET_KEY')
  }

  stripeInstance = new Stripe(apiKey, {
    apiVersion: '2025-07-30.basil',
    typescript: true,
  })

  return stripeInstance
}
