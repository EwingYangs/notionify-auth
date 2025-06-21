import Head from 'next/head'

function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>错误 - Notionify Auth</title>
        <meta name="description" content="页面发生错误" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <main className="main">
          <div className="error-content">
            <h1 className="error-title">
              {statusCode ? `${statusCode} - ` : ''}页面发生错误
            </h1>
            <p className="error-message">
              {statusCode
                ? `服务器返回了 ${statusCode} 错误`
                : '客户端发生错误'}
            </p>
            <div className="error-actions">
              <a href="/" className="back-home">
                返回首页
              </a>
              <button 
                onClick={() => window.location.reload()} 
                className="refresh-page"
              >
                刷新页面
              </button>
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

        .error-content {
          text-align: center;
          max-width: 500px;
          width: 100%;
          background: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .error-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .error-message {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .back-home,
        .refresh-page {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .back-home {
          background: #667eea;
          color: white;
          border: none;
        }

        .back-home:hover {
          background: #5a6fd8;
          transform: translateY(-2px);
        }

        .refresh-page {
          background: #28a745;
          color: white;
          border: none;
        }

        .refresh-page:hover {
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
          .error-content {
            padding: 2rem 1.5rem;
          }
          
          .error-title {
            font-size: 1.5rem;
          }
          
          .error-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error 