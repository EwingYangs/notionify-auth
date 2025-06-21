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
  try {
    console.log('测试Supabase连接...')
    
    // 测试简单查询
    const { data, error } = await supabase
      .from('auth_code')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase连接测试失败:', error)
      return res.status(500).json({ 
        error: 'Supabase连接失败',
        details: error.message 
      })
    }

    console.log('Supabase连接测试成功:', data)
    return res.status(200).json({ 
      success: true, 
      message: 'Supabase连接正常',
      data: data 
    })
  } catch (err) {
    console.error('测试时发生错误:', err)
    return res.status(500).json({ 
      error: '测试失败',
      details: err.message 
    })
  }
} 