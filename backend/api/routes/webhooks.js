const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful checkout
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.user_id;
  
  if (!userId) {
    console.error('No user ID in checkout session metadata');
    return;
  }

  // Update user subscription status
  await supabase
    .from('users')
    .update({ 
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  console.log(`Checkout completed for user: ${userId}`);
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer;
  
  // Get user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update user with subscription info
  await supabase
    .from('users')
    .update({
      subscription_id: subscription.id,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  console.log(`Subscription created for user: ${user.id}`);
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  
  // Get user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status based on Stripe status
  let status = 'inactive';
  if (subscription.status === 'active') {
    status = 'active';
  } else if (subscription.status === 'canceled') {
    status = 'cancelled';
  }

  await supabase
    .from('users')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  console.log(`Subscription updated for user: ${user.id}, status: ${status}`);
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  // Get user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update user subscription status
  await supabase
    .from('users')
    .update({
      subscription_id: null,
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  console.log(`Subscription cancelled for user: ${user.id}`);
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  
  // Get user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update user subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  console.log(`Payment succeeded for user: ${user.id}`);
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  // Get user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update user subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: 'inactive',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  console.log(`Payment failed for user: ${user.id}`);
}

module.exports = router;
