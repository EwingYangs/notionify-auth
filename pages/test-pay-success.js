import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { platforms } from '../config/platforms'

export default function TestPaySuccess() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('cs_live_a1mT0nVk3XcvBapP8g7YcGSNPVPV8BSyzzc4toNY5RsIQU3pIMGDe6EGdu')
  const [app, setApp] = useState('xiaohongshu')
  const [time, setTime] = useState('week')

  const handleTest = () => {
    const url = `/pay/success?session_id=${sessionId}&app=${app}&time=${time}`
    router.push(url)
  }

  return (
    <>
      <Head>
        <title>测试支付成功页面 - Notionify Auth</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">测试支付成功页面</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session ID
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入Stripe session ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                应用平台
              </label>
              <select
                value={app}
                onChange={(e) => setApp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                版本类型
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">体验版（一周）</option>
                <option value="permanent">永久版</option>
              </select>
            </div>

            <button
              onClick={handleTest}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              测试支付成功页面
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">生成的URL：</h3>
            <code className="text-xs text-gray-600 break-all">
              {`/pay/success?session_id=${sessionId}&app=${app}&time=${time}`}
            </code>
          </div>
        </div>
      </div>
    </>
  )
} 