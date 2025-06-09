import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Success() {
  const router = useRouter()
  const [tokenData, setTokenData] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    // 获取URL参数
    const { 
      access_token, 
      token_type, 
      bot_id, 
      workspace_name, 
      workspace_icon, 
      workspace_id,
      owner_type,
      owner_user,
      project_key,
      project_name,
      error: errorParam 
    } = router.query

    if (errorParam) {
      setError(errorParam)
    } else if (access_token) {
      setTokenData({
        access_token,
        token_type,
        bot_id,
        workspace_name,
        workspace_icon,
        workspace_id,
        owner_type,
        owner_user: owner_user ? JSON.parse(owner_user) : null,
        project_key,
        project_name
      })
    }
  }, [router.query])

  // 复制到剪贴板
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 重新授权
  const handleReauth = () => {
    router.push('/')
  }

  if (error) {
    return (
      <>
        <Head>
          <title>授权失败 - Notionify Auth</title>
        </Head>
        <div className="container">
          <main className="main">
            <div className="error-section">
              <div className="error-icon">❌</div>
              <h1>授权失败</h1>
              <p className="error-message">
                {error === 'missing_code' ? '缺少授权码' : error}
              </p>
              <button className="retry-button" onClick={handleReauth}>
                重新授权
              </button>
            </div>
          </main>
        </div>
        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
          }
          .error-section {
            text-align: center;
            color: white;
            max-width: 500px;
          }
          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .error-message {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          .retry-button {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
            background: white;
            color: #333;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
        `}</style>
      </>
    )
  }

  if (!tokenData) {
    return (
      <>
        <Head>
          <title>加载中... - Notionify Auth</title>
        </Head>
        <div className="container">
          <main className="main">
            <div className="loading">
              <div className="spinner"></div>
              <p>正在处理授权信息...</p>
            </div>
          </main>
        </div>
        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .loading {
            text-align: center;
            color: white;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>授权成功 - Notionify Auth</title>
      </Head>
      
      <div className="container">
        <main className="main">
          <div className="success-section">
            <div className="success-header">
              <div className="success-icon">✅</div>
              <h1>授权成功！</h1>
              <p className="success-message">
                已成功连接到你的 Notion 工作区
              </p>
            </div>

            <div className="token-info">
              {tokenData.project_name && (
                <div className="project-info-section">
                  <h2>项目信息</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>项目名称:</label>
                      <div className="info-value">
                        {tokenData.project_name}
                      </div>
                    </div>
                    <div className="info-item">
                      <label>项目标识:</label>
                      <div className="info-value">
                        {tokenData.project_key}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="token-section">
                <h2>访问令牌</h2>
                <div className="token-item">
                  <label>Notion Secret:</label>
                  <div className="token-value">
                    <code className="token-code">
                      {tokenData.access_token}
                    </code>
                    <button 
                      className={`copy-button ${copied === 'token' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(tokenData.access_token, 'token')}
                    >
                      {copied === 'token' ? '已复制!' : '复制'}
                    </button>
                  </div>
                </div>
                <div className="spacer"></div>
                <div className="token-item">
                  <label>Notion Page:</label>
                  <div className="token-value">
                    <code className="token-code">
                      {tokenData.duplicated_template_id || ''}
                    </code>
                    <button 
                      className={`copy-button ${copied === 'token' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(tokenData.access_token, 'token')}
                    >
                      {copied === 'token' ? '已复制!' : '复制'}
                    </button>
                  </div>
                </div>
              </div>

              {tokenData.owner_user && (
                <div className="owner-section">
                  <h2>授权用户信息</h2>
                  <div className="user-info">
                    <div className="user-avatar">
                      {tokenData.owner_user.avatar_url ? (
                        <img src={tokenData.owner_user.avatar_url} alt="用户头像" />
                      ) : (
                        <div className="avatar-placeholder">👤</div>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {tokenData.owner_user.name || '未知用户'}
                      </div>
                      <div className="user-email">
                        {tokenData.owner_user.person?.email || ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="actions">
              <button className="action-button primary" onClick={handleReauth}>
                重新授权
              </button>
              <button 
                className="action-button secondary"
                onClick={() => copyToClipboard(JSON.stringify(tokenData, null, 2), 'all')}
              >
                {copied === 'all' ? '已复制全部信息!' : '复制全部信息'}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding-top: 2rem;
        }

        .success-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .success-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-header h1 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .success-message {
          color: #718096;
          font-size: 1.1rem;
        }

        .token-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .project-info-section, .workspace-info, .token-section, .owner-section {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .project-info-section {
          background: linear-gradient(135deg, #667eea20, #764ba220);
          border-color: #667eea40;
        }

        .project-info-section h2, .workspace-info h2, .token-section h2, .owner-section h2 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .info-grid {
          display: grid;
          gap: 1rem;
        }

        .info-item, .token-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item label, .token-item label {
          font-weight: 600;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .info-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f7fafc;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
        }

        .workspace-icon {
          font-size: 1.2rem;
        }

        .token-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .token-code {
          flex: 1;
          padding: 0.75rem;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.85rem;
          word-break: break-all;
          color: #2d3748;
        }

        .copy-button {
          padding: 0.5rem 1rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .copy-button:hover {
          background: #3182ce;
        }

        .copy-button.copied {
          background: #48bb78;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 1.5rem;
          color: #a0aec0;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .user-email {
          color: #718096;
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .action-button.primary {
          background: #4299e1;
          color: white;
        }

        .action-button.primary:hover {
          background: #3182ce;
          transform: translateY(-2px);
        }

        .action-button.secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .action-button.secondary:hover {
          background: #cbd5e0;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .success-section {
            margin: 1rem;
            padding: 1.5rem;
          }
          
          .token-value {
            flex-direction: column;
            align-items: stretch;
          }
          
          .copy-button {
            align-self: flex-end;
          }
          
          .actions {
            flex-direction: column;
          }
        }

        .spacer {
          height: 1.5rem;
        }
      `}</style>
    </>
  )
} 