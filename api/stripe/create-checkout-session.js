import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  console.log('=== CHECKOUT SESSION REQUEST ===')
  console.log('Method:', req.method)
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, priceId } = req.body
    console.log('Creating checkout session for:', { userId, priceId })

    if (!userId || !priceId) {
      console.log('Missing parameters:', { userId: !!userId, priceId: !!priceId })
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Check environment variables
    console.log('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })

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
    
    // Use the correct frontend URL - hardcode the correct domain
    const frontendUrl = 'https://plant-planner-3-0.vercel.app'
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
      success_url: `${frontendUrl}/app`,
      cancel_url: `${frontendUrl}/app`,
      customer_email: user.email,
      metadata: {
        userId: userId,
      },
    })

    console.log('Stripe session created:', session.id)
    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('=== CHECKOUT SESSION ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error:', JSON.stringify(error, null, 2))
    
    // Ensure we always return valid JSON
    try {
      res.status(500).json({ 
        error: 'Internal server error', 
        details: error.message,
        type: typeof error
      })
    } catch (jsonError) {
      console.error('Failed to send JSON response:', jsonError)
      res.status(500).send('Internal server error')
    }
  }
}
