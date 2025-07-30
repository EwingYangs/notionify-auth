import Stripe from 'stripe'

// 初始化Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function validateStripeSession(sessionId) {
  if (!sessionId) {
    return { 
      success: false,
      error: '缺少session_id参数' 
    }
  }

  console.log(`开始验证Stripe session: ${sessionId}`)

  // 验证session_id格式
  if (!sessionId.startsWith('cs_')) {
    return { 
      success: false,
      error: '无效的session_id格式' 
    }
  }

  try {
    // 使用Stripe SDK验证session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('Stripe session验证结果:', {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency
    })

    // 检查支付状态
    if (session.payment_status !== 'paid') {
      return { 
        success: false,
        error: '支付未完成，状态：' + session.payment_status 
      }
    }

    // 检查session状态
    if (session.status !== 'complete') {
      return { 
        success: false,
        error: 'session未完成，状态：' + session.status 
      }
    }

    // 验证成功
    return { 
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        created: session.created
      }
    }

  } catch (stripeError) {
    console.error('Stripe API错误:', stripeError)
    
    if (stripeError.type === 'StripeInvalidRequestError') {
      return { 
        success: false,
        error: '无效的session_id' 
      }
    }
    
    return { 
      success: false,
      error: 'Stripe验证失败：' + stripeError.message 
    }
  }
} 