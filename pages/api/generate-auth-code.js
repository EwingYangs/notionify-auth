import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cnnscmxjtezsjwviuldf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNubnNjbXhqdGV6c2p3dml1bGRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ2NTAxNiwiZXhwIjoyMDY2MDQxMDE2fQ.rFWz62I3Pflf5LcB4jW2toI--goRTYoH6dobSb9TomU'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    // 验证密码
    const LOCAL_PASSWORD = '2300585123wade'
    if (password !== LOCAL_PASSWORD) {
      return res.status(401).json({ error: '密码错误' })
    }

    console.log('开始插入记录到Supabase...')

    // 使用Supabase客户端插入记录
    const { data, error } = await supabase
      .from('auth_code')
      .insert([{}])  // 插入空对象，让数据库使用默认值
      .select('code')
      .single()

    if (error) {
      console.error('插入记录失败:', error)
      return res.status(500).json({ 
        error: '生成授权码失败',
        details: error.message 
      })
    }

    console.log('插入成功，返回数据:', data)

    if (data && data.code) {
      return res.status(200).json({ 
        success: true, 
        code: data.code,
        message: '授权码生成成功'
      })
    } else {
      console.error('未获取到授权码，返回数据:', data)
      return res.status(500).json({ error: '生成授权码失败，未获取到授权码' })
    }
  } catch (err) {
    console.error('生成授权码时发生错误:', err)
    return res.status(500).json({ 
      error: '服务器内部错误',
      details: err.message 
    })
  }
} 