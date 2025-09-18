const { createClient } = require('@supabase/supabase-js')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId
  const customerId = session.customer

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  // Update user with Stripe customer ID and active subscription
  const { error } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
      subscription_status: 'active'
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user subscription:', error)
  } else {
    console.log(`User ${userId} subscription activated`)
  }
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer
  const status = subscription.status

  // Map Stripe status to our status
  let subscriptionStatus = 'inactive'
  if (status === 'active') subscriptionStatus = 'active'
  else if (status === 'past_due') subscriptionStatus = 'past_due'
  else if (status === 'canceled') subscriptionStatus = 'canceled'
  else if (status === 'unpaid') subscriptionStatus = 'unpaid'

  // Update user subscription status
  const { error } = await supabase
    .from('users')
    .update({ subscription_status: subscriptionStatus })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating subscription status:', error)
  } else {
    console.log(`Subscription ${subscription.id} updated to ${subscriptionStatus}`)
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
