import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch all active prices from Stripe
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    })

    // Format the prices for the frontend
    const formattedPrices = prices.data.map(price => ({
      id: price.id,
      name: price.product.name,
      description: price.product.description,
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      interval_count: price.recurring?.interval_count,
      product_id: price.product.id
    }))

    res.status(200).json({ prices: formattedPrices })
  } catch (error) {
    console.error('Error fetching Stripe prices:', error)
    res.status(500).json({ error: 'Failed to fetch prices' })
  }
}
