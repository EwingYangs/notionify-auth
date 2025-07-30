import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getPlatformLabel, getPlatformTutorialLink } from '../../config/platforms'

export default function PaySuccess() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authCode, setAuthCode] = useState(null)
  const [sessionValid, setSessionValid] = useState(false)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const { session_id, app, time } = router.query

        if (!session_id || !app || !time) {
          setError('缺少必要的参数')
          setLoading(false)
          return
        }

        // 1. 验证Stripe session
        const validateResponse = await fetch('/api/validate-stripe-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: session_id
          })
        })

        const validateResult = await validateResponse.json()

        if (!validateResult.success) {
          setError('支付验证失败：' + validateResult.error)
          setLoading(false)
          return
        }

        setSessionValid(true)

        // 2. 生成授权码
        const isTrialVersion = time === 'week'
        const platform = app

        const authResponse = await fetch('/api/generate-auth-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: platform,
            isTrialVersion: isTrialVersion,
            sessionId: session_id
          })
        })

        const authResult = await authResponse.json()

        if (authResult.success) {
          setAuthCode(authResult.code)
        } else {
          setError('生成授权码失败：' + authResult.error)
        }

        setLoading(false)
      } catch (err) {
        console.error('处理支付成功页面时发生错误:', err)
        setError('服务器错误，请稍后重试')
        setLoading(false)
      }
    }

    if (router.isReady) {
      validatePayment()
    }
  }, [router.isReady, router.query])

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

  if (loading) {
    return (
      <>
        <Head>
          <title>加载中... - Notionify Auth</title>
        </Head>
        <div className="container">
          <main className="main">
            <div className="loading">
              <div className="spinner"></div>
              <p>正在验证支付信息...</p>
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

  if (error) {
    return (
      <>
        <Head>
          <title>验证失败 - Notionify Auth</title>
        </Head>
        <div className="container">
          <main className="main">
            <div className="error-section">
              <div className="error-icon">❌</div>
              <h1>验证失败</h1>
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={handleReauth}>
                返回首页
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

  return (
    <>
      <Head>
        <title>支付成功 - Notionify Auth</title>
      </Head>
      
      <div className="container">
        <main className="main">
          <div className="success-section">
            <div className="success-header">
              <div className="success-icon">✅</div>
              <h1>支付成功！</h1>
              <p className="success-message">
                已成功完成支付，您的授权码已生成
              </p>
            </div>

            <div className="token-info">
              <div className="project-info-section">
                <h2>订单信息</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>应用平台:</label>
                    <div className="info-value">
                      {getPlatformLabel(router.query.app)}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>版本类型:</label>
                    <div className="info-value">
                      {router.query.time === 'week' ? '体验版（一周）' : '永久版'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>订单ID:</label>
                    <div className="info-value">
                      {router.query.session_id}
                    </div>
                  </div>
                </div>
              </div>

              {authCode && (
                <div className="token-section">
                  <h2>授权码</h2>
                  <div className="token-item">
                    <label>授权码（必须妥善保管）:</label>
                    <div className="token-value">
                      <code className="token-code">
                        {authCode}
                      </code>
                      <button 
                        className={`copy-button ${copied === 'authCode' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(authCode, 'authCode')}
                      >
                        {copied === 'authCode' ? '已复制!' : '复制'}
                      </button>
                    </div>
                  </div>
                  
                  {/* 添加平台教程链接 */}
                  {getPlatformTutorialLink(router.query.app) && (
                    <div className="tutorial-section">
                      <div className="tutorial-header">
                        <div className="tutorial-icon">📚</div>
                        <h3>使用教程</h3>
                      </div>
                      <div className="tutorial-content">
                        <p>
                          获取到授权码后，请按照以下教程进行同步：
                        </p>
                        <a 
                          href={getPlatformTutorialLink(router.query.app)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="tutorial-link"
                        >
                          📖 查看 {getPlatformLabel(router.query.app)} 使用教程
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="security-notice">
              <div className="security-header">
                <div className="security-icon">🔒</div>
                <h3>重要提醒</h3>
              </div>
              <div className="security-content">
                <p>
                  <strong>请妥善保管您的授权码：</strong>
                </p>
                <ul className="security-list">
                  <li>✅ 授权码是您使用服务的唯一凭证</li>
                  <li>✅ 请勿与他人分享您的授权码</li>
                  <li>✅ 如遇问题请联系客服</li>
                </ul>
              </div>
            </div>

            <div className="actions">
              <button className="action-button primary" onClick={handleReauth}>
                返回首页
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

        .project-info-section, .token-section {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .project-info-section {
          background: linear-gradient(135deg, #667eea20, #764ba220);
          border-color: #667eea40;
        }

        .project-info-section h2, .token-section h2 {
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

        .security-notice {
          background: linear-gradient(135deg, #48bb7820, #38a16920);
          border: 1px solid #48bb7840;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .security-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .security-icon {
          font-size: 1.5rem;
        }

        .security-header h3 {
          color: #2d3748;
          margin: 0;
          font-size: 1.2rem;
        }

        .security-content p {
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .security-list {
          margin: 1rem 0;
          padding-left: 0;
          list-style: none;
        }

        .security-list li {
          color: #2d3748;
          margin-bottom: 0.5rem;
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        /* 教程部分样式 */
        .tutorial-section {
          background: linear-gradient(135deg, #4299e120, #3182ce20);
          border: 1px solid #4299e140;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .tutorial-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tutorial-icon {
          font-size: 1.5rem;
        }

        .tutorial-header h3 {
          color: #2d3748;
          margin: 0;
          font-size: 1.2rem;
        }

        .tutorial-content p {
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .tutorial-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
        }

        .tutorial-link:hover {
          background: #3182ce;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(66, 153, 225, 0.4);
        }

        .tutorial-link:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  )
} 