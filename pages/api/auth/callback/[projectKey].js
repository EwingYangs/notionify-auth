import { getProjectConfig } from '../../../../config/projects'

/**
 * 动态路由的Notion OAuth回调处理API
 * 路由：/api/auth/callback/[projectKey]
 * 每个项目有独立的回调URL
 */
export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { projectKey } = req.query
  const { code, state, error } = req.query

  // 检查项目key
  if (!projectKey) {
    console.error('缺少项目标识')
    return res.redirect('/success?error=missing_project_key')
  }

  // 检查是否有错误参数
  if (error) {
    console.error('OAuth错误:', error)
    return res.redirect(`/success?error=${encodeURIComponent(error)}&project=${projectKey}`)
  }

  // 检查是否有授权码
  if (!code) {
    console.error('缺少授权码')
    return res.redirect(`/success?error=missing_code&project=${projectKey}`)
  }

  try {
    // 验证项目配置是否存在
    const projectConfig = getProjectConfig(projectKey)
    
    // 调用获取token的函数
    const tokenData = await getNotionTokenByCode(code, projectKey, projectConfig)
    
    // 将token数据作为URL参数传递到成功页面
    const params = new URLSearchParams({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || 'bearer',
      bot_id: tokenData.bot_id || '',
      workspace_name: tokenData.workspace_name || '',
      workspace_icon: tokenData.workspace_icon || '',
      workspace_id: tokenData.workspace_id || '',
      duplicated_template_id: tokenData.duplicated_template_id || '',
      owner_type: tokenData.owner?.type || '',
      owner_user: tokenData.owner?.user ? JSON.stringify(tokenData.owner.user) : '',
      project_key: projectKey,
      project_name: tokenData.projectName || ''
    })

    // 重定向到成功页面
    res.redirect(`/success?${params.toString()}`)
    
  } catch (error) {
    console.error('获取token失败:', error)
    return res.redirect(`/success?error=${encodeURIComponent(error.message)}&project=${projectKey}`)
  }
}

/**
 * 根据授权码和项目配置获取Notion访问令牌
 * 模仿Python函数逻辑，支持多项目配置
 */
async function getNotionTokenByCode(code, projectKey, projectConfig) {
  const { clientId, clientSecret, redirectUrl, name } = projectConfig

  if (!clientId || !clientSecret || !redirectUrl) {
    throw new Error(`项目配置不完整: ${projectKey}`)
  }

  // 创建Authorization头部 - Basic认证
  // Authorization: Basic "$CLIENT_ID:$CLIENT_SECRET"
  const credentials = `${clientId}:${clientSecret}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')

  const headers = {
    'Authorization': `Basic ${encodedCredentials}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28' // 添加Notion版本头
  }

  // 创建请求体
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUrl
  }

  console.log('发起token请求:', {
    url: 'https://api.notion.com/v1/oauth/token',
    headers: { ...headers, Authorization: '[隐藏]' },
    data,
    project: projectKey
  })

  // 发送POST请求到Notion API
  const response = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })

  // 检查响应状态
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Notion API错误响应:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      project: projectKey
    })
    throw new Error(`获取Notion Token失败，状态码: ${response.status}. 请检查提供的授权码是否正确`)
  }

  // 解析JSON响应
  const responseData = await response.json()
  
  console.log('成功获取token:', {
    access_token: responseData.access_token ? '[已获取]' : '[未获取]',
    bot_id: responseData.bot_id,
    workspace_name: responseData.workspace_name,
    workspace_id: responseData.workspace_id,
    project: projectKey
  })

  // 添加项目信息到返回数据
  responseData.projectKey = projectKey
  responseData.projectName = name

  return responseData
} 