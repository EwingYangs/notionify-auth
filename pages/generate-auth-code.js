import { useState } from 'react'
import Head from 'next/head'
import { platforms } from '../config/platforms'

export default function GenerateAuthCode() {
  const [password, setPassword] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('xiaohongshu')
  const [isTrialVersion, setIsTrialVersion] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    setIsLoading(true)
    try {
      // 调用API路由生成授权码
      const response = await fetch('/api/generate-auth-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password,
          platform: selectedPlatform,
          isTrialVersion
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || '生成授权码失败')
        return
      }

      if (result.success && result.code) {
        setAuthCode(result.code)
        setSuccess(result.message || '授权码生成成功！')
        setPassword('') // 清空密码
      } else {
        setError('生成授权码失败，未获取到授权码')
      }
    } catch (err) {
      console.error('生成授权码时发生错误:', err)
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(authCode)
      setSuccess('授权码已复制到剪贴板！')
    } catch (err) {
      console.error('复制失败:', err)
      setError('复制失败，请手动复制')
    }
  }

  const generateNewCode = () => {
    setAuthCode('')
    setError('')
    setSuccess('')
  }

  return (
    <>
      <Head>
        <title>生成授权码 - Notionify Auth</title>
        <meta name="description" content="生成Notion授权码" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <main className="main">
          <div className="hero">
            <h1 className="title">
              🔑 生成授权码
            </h1>
            <p className="description">
              输入密码生成新的授权码
            </p>

            {/* 密码输入表单 */}
            {!authCode && (
              <div className="password-form">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="input-group">
                    <label htmlFor="platform">选择应用</label>
                    <select
                      id="platform"
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="platform-select"
                      disabled={isLoading}
                    >
                      {platforms.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <div className="version-checkbox">
                      <input
                        type="checkbox"
                        id="trial-version"
                        checked={isTrialVersion}
                        onChange={(e) => setIsTrialVersion(e.target.checked)}
                        disabled={isLoading}
                      />
                      <label htmlFor="trial-version">
                        <span className="checkbox-label">体验版（一周有效期）</span>
                        <span className="version-info">默认：永久版</span>
                      </label>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="password">管理员密码</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入管理员密码"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`submit-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        生成中...
                      </>
                    ) : (
                      '生成授权码'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* 授权码显示区域 */}
            {authCode && (
              <div className="auth-code-section">
                <div className="auth-code-card">
                  <h3>✅ 授权码生成成功</h3>
                  <div className="code-display">
                    <label>授权码：</label>
                    <div className="code-container">
                      <code className="auth-code">{authCode}</code>
                      <button 
                        className="copy-button"
                        onClick={copyToClipboard}
                        title="复制授权码"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="code-actions">
                    <button 
                      className="generate-new-button"
                      onClick={generateNewCode}
                    >
                      生成新授权码
                    </button>
                    <a href="/" className="back-home-button">
                      返回首页
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 错误和成功消息 */}
            {error && (
              <div className="message error">
                <span className="message-icon">❌</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="message success">
                <span className="message-icon">✅</span>
                {success}
              </div>
            )}

            {/* 返回首页链接 */}
            <div className="back-link">
              <a href="/">← 返回首页</a>
            </div>
          </div>
        </main>

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
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .title {
          margin: 0 0 1rem 0;
          line-height: 1.15;
          font-size: 3rem;
          color: white;
          font-weight: bold;
        }

        .description {
          margin: 0 0 2rem 0;
          line-height: 1.5;
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .password-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .platform-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          background-color: white;
          transition: border-color 0.3s ease;
          cursor: pointer;
        }

        .platform-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .platform-select:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .version-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          transition: border-color 0.3s ease;
        }

        .version-checkbox:focus-within {
          border-color: #667eea;
        }

        .version-checkbox input[type="checkbox"] {
          margin: 0;
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .version-checkbox input[type="checkbox"]:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .version-checkbox label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          margin: 0;
          flex: 1;
        }

        .checkbox-label {
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .version-info {
          font-size: 14px;
          color: #6c757d;
          font-style: italic;
        }

        .password-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .password-input input:focus {
          outline: none;
          border-color: #667eea;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .toggle-password:hover {
          background-color: #f5f5f5;
        }

        .submit-button {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-code-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .auth-code-card h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.5rem;
        }

        .code-display {
          margin-bottom: 1.5rem;
        }

        .code-display label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .code-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          border: 2px solid #e9ecef;
        }

        .auth-code {
          flex: 1;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          color: #495057;
          word-break: break-all;
          background: none;
          border: none;
          padding: 0;
        }

        .copy-button {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .copy-button:hover {
          background: #5a6fd8;
        }

        .code-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .generate-new-button,
        .back-home-button {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .generate-new-button {
          background: #28a745;
          color: white;
          border: none;
          cursor: pointer;
        }

        .generate-new-button:hover {
          background: #218838;
        }

        .back-home-button {
          background: #6c757d;
          color: white;
          border: none;
        }

        .back-home-button:hover {
          background: #5a6268;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message-icon {
          font-size: 18px;
        }

        .back-link {
          margin-top: 2rem;
        }

        .back-link a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .back-link a:hover {
          color: white;
        }

        .footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }
          
          .description {
            font-size: 1rem;
          }
          
          .password-form,
          .auth-code-section {
            padding: 1.5rem;
          }
          
          .code-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
} 