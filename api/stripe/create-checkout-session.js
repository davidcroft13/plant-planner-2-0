import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, priceId } = req.body

    if (!userId || !priceId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/app?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: userId,
      },
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
