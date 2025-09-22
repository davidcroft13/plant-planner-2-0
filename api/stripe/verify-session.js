import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' })
    }

    console.log('Verifying session:', session_id)

    const session = await stripe.checkout.sessions.retrieve(session_id)

    console.log('Session details:', {
      id: session.id,
      status: session.payment_status,
      customer: session.customer,
      metadata: session.metadata
    })

    res.status(200).json({
      session: {
        id: session.id,
        status: session.payment_status,
        customer: session.customer,
        metadata: session.metadata
      }
    })
  } catch (error) {
    console.error('Error verifying session:', error)
    res.status(500).json({ error: 'Failed to verify session' })
  }
}
