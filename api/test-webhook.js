export default async function handler(req, res) {
  console.log('Test webhook endpoint called:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  })

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Webhook test endpoint is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'POST request received',
      body: req.body,
      headers: req.headers,
      timestamp: new Date().toISOString()
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
