import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - 页面未找到 - Notionify Auth</title>
        <meta name="description" content="页面未找到" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <main className="main">
          <div className="not-found-content">
            <h1 className="not-found-title">
              404 - 页面未找到
            </h1>
            <p className="not-found-message">
              抱歉，您访问的页面不存在
            </p>
            <div className="not-found-actions">
              <a href="/" className="back-home">
                返回首页
              </a>
              <a href="/generate-auth-code" className="generate-code">
                生成授权码
              </a>
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

        .not-found-content {
          text-align: center;
          max-width: 500px;
          width: 100%;
          background: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .not-found-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .not-found-message {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .back-home,
        .generate-code {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .back-home {
          background: #667eea;
          color: white;
        }

        .back-home:hover {
          background: #5a6fd8;
          transform: translateY(-2px);
        }

        .generate-code {
          background: #28a745;
          color: white;
        }

        .generate-code:hover {
          background: #218838;
          transform: translateY(-2px);
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
          .not-found-content {
            padding: 2rem 1.5rem;
          }
          
          .not-found-title {
            font-size: 2rem;
          }
          
          .not-found-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
} 