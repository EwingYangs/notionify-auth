/**
 * 多项目OAuth配置
 * 每个项目都有独立的Client ID、Client Secret和重定向URL
 */

const projects = {
  // 小红书项目
  rednote: {
    name: "小红书",
    description: "小红书同步到Notion",
    clientId: process.env.REDNOTE_CLIENT_ID,
    clientSecret: process.env.REDNOTE_CLIENT_SECRET,
    redirectUrl: process.env.REDNOTE_REDIRECT_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/rednote`,
    icon: "📍"
  }
}

/**
 * 获取所有可用的项目配置
 */
export function getAvailableProjects() {
  return Object.entries(projects)
    .filter(([key, config]) => config.clientId && config.clientSecret && config.redirectUrl)
    .map(([key, config]) => ({
      key,
      ...config
    }))
}

/**
 * 根据项目key获取项目配置
 */
export function getProjectConfig(projectKey) {
  const config = projects[projectKey]
  
  if (!config) {
    throw new Error(`项目配置不存在: ${projectKey}`)
  }
  
  if (!config.clientId || !config.clientSecret || !config.redirectUrl) {
    throw new Error(`项目配置不完整: ${projectKey}`)
  }
  
  return config
}

/**
 * 验证项目配置是否完整
 */
export function validateProjects() {
  const validProjects = []
  const invalidProjects = []
  
  Object.entries(projects).forEach(([key, config]) => {
    if (config.clientId && config.clientSecret && config.redirectUrl) {
      validProjects.push({ key, ...config })
    } else {
      invalidProjects.push({ key, ...config, missing: [] })
      if (!config.clientId) invalidProjects[invalidProjects.length - 1].missing.push('clientId')
      if (!config.clientSecret) invalidProjects[invalidProjects.length - 1].missing.push('clientSecret')
      if (!config.redirectUrl) invalidProjects[invalidProjects.length - 1].missing.push('redirectUrl')
    }
  })
  
  return { validProjects, invalidProjects }
}

export default projects 