# Notionify Auth - Notion OAuth 授权项目

## 项目简介

这是一个简单的Notion OAuth授权项目，用户可以通过此项目授权连接到Notion，获取访问token和模板ID。项目使用Next.js构建，可以轻松部署到Vercel。

## 功能特性

- 🔐 Notion OAuth 2.0 授权流程
- 🎯 多项目支持，一个应用管理多个Notion项目
- 📄 获取授权后的访问token和工作区信息
- 🎨 美观的项目选择界面
- 🚀 支持Vercel一键部署
- 💻 响应式设计，支持移动端
- 🔑 授权码生成功能，支持密码验证和Supabase存储

## 项目结构

```
notionify-auth/
├── README.md                # 项目说明文档
├── DEPLOYMENT.md           # 部署指南
├── package.json            # 项目依赖配置
├── next.config.js         # Next.js配置
├── vercel.json            # Vercel部署配置
├── config/
│   └── projects.js        # 多项目配置管理
├── pages/
│   ├── _app.js           # 应用入口
│   ├── _error.js         # 错误处理页面
│   ├── 404.js            # 404页面
│   ├── index.js          # 首页，项目选择和授权
│   ├── generate-auth-code.js  # 生成授权码页面
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback.js  # OAuth回调处理
│   │   └── generate-auth-code.js  # 授权码生成API
│   └── success.js        # 授权成功页面
└── styles/
    └── globals.css       # 全局样式

```

## 环境变量配置

创建 `.env.local` 文件，配置多个项目的OAuth信息：

```env
# 小红书项目配置
REDNOTE_CLIENT_ID=your_rednote_client_id
REDNOTE_CLIENT_SECRET=your_rednote_client_secret
# REDNOTE_REDIRECT_URL=http://localhost:3000/api/auth/callback/rednote (可选，会自动生成)

# 项目2配置（可选）
PROJECT2_CLIENT_ID=your_project2_client_id
PROJECT2_CLIENT_SECRET=your_project2_client_secret
# PROJECT2_REDIRECT_URL=http://localhost:3000/api/auth/callback/project2 (可选，会自动生成)

# 项目3配置（可选）
PROJECT3_CLIENT_ID=your_project3_client_id
PROJECT3_CLIENT_SECRET=your_project3_client_secret
# PROJECT3_REDIRECT_URL=http://localhost:3000/api/auth/callback/project3 (可选，会自动生成)

# Next.js配置
NEXTAUTH_URL=http://localhost:3000

# Supabase配置（用于授权码存储）
SUPABASE_URL=https://cnnscmxjtezszjwiuldf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNubnNjbXhqdGV6c2p3dml1bGRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ2NTAxNiwiZXhwIjoyMDY2MDQxMDE2fQ.rFWz62I3Pflf5LcB4jW2toI--goRTYoH6dobSb9TomU
```

**注意**：你可以配置1-3个项目，每个项目都需要完整的三个环境变量。项目配置可以在 `config/projects.js` 中自定义。

### 获取Notion OAuth配置

1. 访问 [Notion开发者页面](https://www.notion.so/my-integrations)
2. 创建新的集成(Integration)
3. 获取Client ID和Client Secret
4. 设置重定向URL为你的域名 + `/api/auth/callback`

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 `http://localhost:3000`

## Vercel部署

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量（将本地的.env.local内容复制到Vercel环境变量中）
4. 更新NOTION_REDIRECT_URL_V2为生产域名
5. 部署完成

## 使用方法

### Notion OAuth 授权
1. 访问首页，如果配置了多个项目，先选择要授权的项目
2. 点击"授权连接 Notion"按钮
3. 跳转到Notion授权页面，选择要授权的工作区和页面
4. 授权成功后，页面会显示：
   - 项目信息（项目名称、标识）
   - 工作区信息（名称、ID、Bot ID）
   - 访问Token (access_token、token_type)
   - 授权用户信息
   - 一键复制功能

### 生成授权码
1. 在首页点击"生成授权码"链接，或直接访问 `/generate-auth-code`
2. 输入管理员密码（默认：admin123）
3. 点击"生成授权码"按钮
4. 系统会在Supabase数据库中创建新记录并返回生成的授权码
5. 可以点击复制按钮将授权码复制到剪贴板
6. 支持生成新的授权码或返回首页

## API接口

### GET /api/auth/callback/[projectKey]

动态路由的OAuth回调接口，每个项目有独立的回调URL。

**路由参数：**
- `projectKey`: 项目标识 (如：`rednote`, `project2`, `project3`)

**URL参数：**
- `code`: Notion返回的授权码
- `error`: 错误信息（如果有）

**示例URL：**
- 小红书项目：`/api/auth/callback/rednote`
- 其他项目：`/api/auth/callback/project2`

**返回：**
重定向到成功页面，并在URL参数中包含token信息。

## 技术栈

- **前端框架**: Next.js 13+
- **样式**: CSS3
- **HTTP客户端**: 内置fetch API
- **部署平台**: Vercel

## 注意事项

- 请妥善保管Client ID和Client Secret
- 生产环境请使用HTTPS
- 定期检查token有效期
- 遵循Notion API使用限制

## 故障排除

### 常见问题

1. **授权失败**: 检查Client ID和Secret是否正确
2. **重定向错误**: 确认重定向URL配置正确
3. **Token无效**: 检查授权流程是否完整

如有问题，请检查浏览器控制台和服务器日志。 