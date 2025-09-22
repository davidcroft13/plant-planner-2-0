export default async function handler(req, res) {
  console.log('Test webhook endpoint hit:', { method: req.method, body: req.body })
  
  return res.status(200).json({ 
    message: 'Test webhook is working',
    method: req.method,
    timestamp: new Date().toISOString(),
    body: req.body
  })
}