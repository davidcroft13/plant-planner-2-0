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

  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' })
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/app/account`,
    })

    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
