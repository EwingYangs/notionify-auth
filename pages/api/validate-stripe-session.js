import { validateStripeSession } from '../../lib/stripe-validator'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { session_id } = req.body
    const result = await validateStripeSession(session_id)
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }

  } catch (err) {
    console.error('验证Stripe session时发生错误:', err)
    return res.status(500).json({ 
      success: false,
      error: '服务器内部错误',
      details: err.message 
    })
  }
} 