import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  console.log('Checkout session request:', { method: req.method, body: req.body })
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, priceId } = req.body
    console.log('Creating checkout session for:', { userId, priceId })

    if (!userId || !priceId) {
      console.log('Missing parameters:', { userId: !!userId, priceId: !!priceId })
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Get user from Supabase
    console.log('Looking up user in Supabase...')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.log('User lookup error:', userError)
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('User found:', { name: user.name, email: user.email })

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...')
    
    // Use the correct frontend URL - hardcoded to ensure it works
    const frontendUrl = process.env.FRONTEND_URL || 'https://plant-planner-3-0.vercel.app'
    console.log('Using frontend URL:', frontendUrl)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${frontendUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/app`,
      customer_email: user.email,
      metadata: {
        userId: userId,
      },
    })

    console.log('Stripe session created:', session.id)
    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
