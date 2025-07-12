import { useState, useEffect } from 'react'
import Head from 'next/head'
import { getAvailableProjects } from '../config/projects'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [availableProjects, setAvailableProjects] = useState([])
  const [showProjects, setShowProjects] = useState(false)

  useEffect(() => {
    // 获取可用的项目配置
    const projects = getAvailableProjects()
    setAvailableProjects(projects)
    
    // 如果只有一个项目，自动选择
    if (projects.length === 1) {
      setSelectedProject(projects[0])
    } else if (projects.length > 1) {
      setShowProjects(true)
    }
  }, [])

  // 生成Notion OAuth授权URL
  const getNotionAuthUrl = (project) => {
    if (!project) {
      alert('请先选择一个项目')
      return null
    }

    const { clientId, redirectUrl } = project
    
    if (!clientId || !redirectUrl) {
      alert(`项目配置不完整: ${project.name}`)
      return null
    }

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      owner: 'user',
      redirect_uri: redirectUrl
    })

    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`
  }

  const handleAuth = () => {
    const authUrl = getNotionAuthUrl(selectedProject)
    if (authUrl) {
      setIsLoading(true)
      window.location.href = authUrl
    }
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setShowProjects(false)
  }

  const backToProjectSelection = () => {
    setSelectedProject(null)
    setShowProjects(true)
  }

  return (
    <>
      <Head>
        <title>Notionify Auth - Notion OAuth 授权</title>
        <meta name="description" content="简单的Notion OAuth授权工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <main className="main">
          <div className="hero">
            <h1 className="title">
              🔗 Notionify Auth
            </h1>
            <p className="description">
              多项目 Notion OAuth 授权工具
            </p>

            {/* 没有可用项目时的提示 */}
            {availableProjects.length === 0 && (
              <div className="no-projects">
                <div className="warning-icon">⚠️</div>
                <h3>没有可用的项目配置</h3>
                <p>请在环境变量中配置至少一个项目的OAuth信息</p>
                <div className="config-hint">
                  <p>需要配置的环境变量格式：</p>
                  <ul>
                    <li>PROJECT1_CLIENT_ID</li>
                    <li>PROJECT1_CLIENT_SECRET</li>
                    <li>PROJECT1_REDIRECT_URL</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 项目选择界面 */}
            {showProjects && availableProjects.length > 0 && (
              <div className="project-selection">
                <p className="subtitle">
                  选择要授权的项目
                </p>
                <div className="projects-grid">
                  {availableProjects.map((project) => (
                    <div
                      key={project.key}
                      className="project-card"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="project-icon">{project.icon}</div>
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-description">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 选中项目后的授权界面 */}
            {selectedProject && (
              <div className="auth-section">
                <div className="selected-project">
                  <div className="project-info">
                    <span className="project-icon-large">{selectedProject.icon}</span>
                    <div>
                      <h3>{selectedProject.name}</h3>
                      <p>{selectedProject.description}</p>
                    </div>
                  </div>
                  {availableProjects.length > 1 && (
                    <button className="change-project" onClick={backToProjectSelection}>
                      更换项目
                    </button>
                  )}
                </div>

                <button 
                  className={`auth-button ${isLoading ? 'loading' : ''}`}
                  onClick={handleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      跳转中...
                    </>
                  ) : (
                    <>
                      <span className="notion-icon">📝</span>
                      授权连接 Notion
                    </>
                  )}
                </button>

                <div className="features">
                  <div className="feature">
                    <h3>🔐 安全授权</h3>
                    <p>使用 Notion 官方 OAuth 2.0 流程</p>
                  </div>
                  <div className="feature">
                    <h3>🎯 多项目支持</h3>
                    <p>支持多个不同的项目配置</p>
                  </div>
                  <div className="feature">
                    <h3>🚀 即时部署</h3>
                    <p>支持 Vercel 一键部署</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 导航区域 */}
        {/* <nav className="nav-section">
          <div className="nav-container">
            <a href="/generate-auth-code" className="nav-link">
              <span className="nav-icon">🔑</span>
              生成授权码
            </a>
          </div>
        </nav> */}

        <footer className="footer">
          <p>Made with ❤️ for Notion users</p>
        </footer>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .hero {
          text-align: center;
          max-width: 800px;
          color: white;
        }

        .title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .description {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .subtitle {
          font-size: 1.1rem;
          margin-bottom: 3rem;
          opacity: 0.8;
          line-height: 1.6;
        }

        .no-projects {
          text-align: center;
          padding: 3rem;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          margin-bottom: 2rem;
        }

        .warning-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-projects h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .config-hint {
          text-align: left;
          background: rgba(0,0,0,0.2);
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 1.5rem;
        }

        .config-hint ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .config-hint li {
          margin: 0.5rem 0;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
        }

        .project-selection {
          margin-bottom: 2rem;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .project-card {
          background: rgba(255,255,255,0.15);
          padding: 2rem;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
        }

        .project-card:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.3);
        }

        .project-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .project-name {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .project-description {
          opacity: 0.9;
          line-height: 1.5;
        }

        .auth-section {
          margin-bottom: 4rem;
        }

        .selected-project {
          background: rgba(255,255,255,0.1);
          padding: 1.5rem;
          border-radius: 15px;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: blur(10px);
        }

        .project-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .project-icon-large {
          font-size: 2rem;
        }

        .project-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }

        .project-info p {
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .change-project {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .change-project:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.5);
        }

        .auth-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          background: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          min-width: 200px;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          background: #f8f9fa;
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-button.loading {
          pointer-events: none;
        }

        .notion-icon {
          font-size: 1.3rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .feature h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .feature p {
          opacity: 0.9;
          line-height: 1.5;
        }

        .footer {
          text-align: center;
          padding: 2rem;
          color: rgba(255,255,255,0.7);
        }

        .nav-section {
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .nav-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255,255,255,0.2);
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2.5rem;
          }
          
          .description {
            font-size: 1.2rem;
          }
          
          .auth-button {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
          }
          
          .features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .project-card {
            padding: 1.5rem;
          }

          .selected-project {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .project-info {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }

          .no-projects {
            padding: 2rem;
          }

          .config-hint {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  )
} 