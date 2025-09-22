import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  console.log('=== WEBHOOK FUNCTION CALLED ===')
  console.log('Method:', req.method)
  console.log('Method type:', typeof req.method)
  console.log('Method === "POST":', req.method === 'POST')
  console.log('Method === POST:', req.method === 'POST')
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  console.log('Body type:', typeof req.body)
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('URL:', req.url)
  console.log('Query:', req.query)
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    console.log('Expected POST, got:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('Processing webhook without signature verification for testing')
  
  const event = req.body

  try {
    console.log('Processing event:', event.type, event.id)
    
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Handling checkout.session.completed')
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case 'customer.subscription.updated':
        console.log('Handling customer.subscription.updated')
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        console.log('Handling customer.subscription.deleted')
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_succeeded':
        console.log('Handling invoice.payment_succeeded')
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        console.log('Handling invoice.payment_failed')
        await handlePaymentFailed(event.data.object)
        break

      case 'customer.created':
        console.log('Handling customer.created')
        await handleCustomerCreated(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    console.log('Event processed successfully:', event.type)
    res.status(200).json({ received: true, eventType: event.type })
  } catch (error) {
    console.error('Webhook handler error:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({ error: 'Webhook handler failed', details: error.message })
  }
}

async function handleCheckoutSessionCompleted(session) {
  console.log('Processing checkout.session.completed:', {
    sessionId: session.id,
    customerId: session.customer,
    metadata: session.metadata,
    paymentStatus: session.payment_status
  })

  const userId = session.metadata?.userId
  const customerId = session.customer

  if (!userId) {
    console.error('No userId in session metadata:', session.metadata)
    throw new Error('No userId in session metadata')
  }

  if (!customerId) {
    console.error('No customer ID in session:', session)
    throw new Error('No customer ID in session')
  }

  console.log('Updating user subscription:', { userId, customerId })

  // Update user with Stripe customer ID and active subscription
  const { data, error } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error updating user subscription:', error)
    throw new Error(`Failed to update user subscription: ${error.message}`)
  } else {
    console.log(`User ${userId} subscription activated successfully:`, data)
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Processing subscription.updated:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status
  })

  const customerId = subscription.customer
  const status = subscription.status

  if (!customerId) {
    console.error('No customer ID in subscription:', subscription)
    throw new Error('No customer ID in subscription')
  }

  // Map Stripe status to our status
  let subscriptionStatus = 'inactive'
  if (status === 'active') subscriptionStatus = 'active'
  else if (status === 'past_due') subscriptionStatus = 'past_due'
  else if (status === 'canceled') subscriptionStatus = 'canceled'
  else if (status === 'unpaid') subscriptionStatus = 'unpaid'

  console.log('Updating subscription status:', { customerId, subscriptionStatus })

  // Update user subscription status
  const { data, error } = await supabase
    .from('users')
    .update({ 
      subscription_status: subscriptionStatus,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)
    .select()

  if (error) {
    console.error('Error updating subscription status:', error)
    throw new Error(`Failed to update subscription status: ${error.message}`)
  } else {
    console.log(`Subscription ${subscription.id} updated to ${subscriptionStatus}:`, data)
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer

  // Set subscription to canceled
  const { error } = await supabase
    .from('users')
    .update({ subscription_status: 'canceled' })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error canceling subscription:', error)
  } else {
    console.log(`Subscription ${subscription.id} canceled`)
  }
}

async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer

  // Ensure subscription is active after successful payment
  const { error } = await supabase
    .from('users')
    .update({ subscription_status: 'active' })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating payment success:', error)
  } else {
    console.log(`Payment succeeded for customer ${customerId}`)
  }
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer

  // Set subscription to past_due
  const { error } = await supabase
    .from('users')
    .update({ subscription_status: 'past_due' })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating payment failure:', error)
  } else {
    console.log(`Payment failed for customer ${customerId}`)
  }
}

async function handleCustomerCreated(customer) {
  // This is optional - you might want to store customer data
  console.log(`New customer created: ${customer.id}`)
}
