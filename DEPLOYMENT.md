# 部署指南

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
在项目根目录创建 `.env.local` 文件：

```env
# 小红书项目配置
REDNOTE_CLIENT_ID=your_rednote_client_id
REDNOTE_CLIENT_SECRET=your_rednote_client_secret
# REDNOTE_REDIRECT_URL=http://localhost:3000/api/auth/callback/rednote (可选，自动生成)

# 其他项目配置（可选）
# PROJECT2_CLIENT_ID=your_project2_client_id
# PROJECT2_CLIENT_SECRET=your_project2_client_secret
# PROJECT2_REDIRECT_URL=http://localhost:3000/api/auth/callback/project2 (可选，自动生成)

# Next.js配置
NEXTAUTH_URL=http://localhost:3000
```

### 3. 获取Notion OAuth凭据

1. 访问 [Notion开发者页面](https://www.notion.so/my-integrations)
2. 点击 "Create new integration"
3. 填写集成信息：
   - 名称：`小红书内容管理` (或其他你喜欢的名称)
   - 关联工作区：选择你的工作区
   - 类型：选择 `Public integration`
4. 创建后，获取：
   - `Client ID` → 复制到 `REDNOTE_CLIENT_ID`
   - `Client Secret` → 复制到 `REDNOTE_CLIENT_SECRET`
5. 在 "OAuth Domain & URIs" 部分添加重定向URI：
   - 开发环境：`http://localhost:3000/api/auth/callback/rednote`
   - 生产环境：`https://your-domain.vercel.app/api/auth/callback/rednote`

### 4. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 测试授权流程。

## Vercel部署

### 方法一：通过Vercel CLI

1. 安装Vercel CLI：
```bash
npm i -g vercel
```

2. 登录Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
vercel
```

4. 在Vercel控制台配置环境变量。

### 方法二：通过Git连接

1. 将代码推送到GitHub仓库

2. 访问 [Vercel控制台](https://vercel.com)

3. 点击 "New Project"

4. 选择你的GitHub仓库

5. 配置环境变量：
   - `REDNOTE_CLIENT_ID`: 你的小红书项目 Notion Client ID
   - `REDNOTE_CLIENT_SECRET`: 你的小红书项目 Notion Client Secret
   - `NEXTAUTH_URL`: `https://your-domain.vercel.app`
   - (可选) 如果有其他项目，添加对应的PROJECT2_*或PROJECT3_*变量
   
   **注意**: 不需要设置REDNOTE_REDIRECT_URL，系统会自动生成为 `https://your-domain.vercel.app/api/auth/callback/rednote`

6. 点击 "Deploy"

### 方法三：一键部署

点击下面的按钮一键部署到Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/notionify-auth&env=REDNOTE_CLIENT_ID,REDNOTE_CLIENT_SECRET,NEXTAUTH_URL)

## 部署后配置

1. 获取你的Vercel域名（例如：`your-app.vercel.app`）

2. 回到Notion开发者页面，更新OAuth重定向URI：
   - 添加：`https://your-app.vercel.app/api/auth/callback/rednote`

3. 确认环境变量 `NEXTAUTH_URL` 设置为你的生产域名

4. 重新部署应用

## 测试授权流程

1. 访问你的应用首页
2. 点击 "授权连接 Notion"
3. 在Notion页面选择要授权的工作区和页面
4. 授权成功后会跳转到成功页面显示token信息

## 故障排除

### 常见问题

1. **授权按钮点击无响应**
   - 检查环境变量是否正确配置
   - 确认Client ID格式正确

2. **重定向URI错误**
   - 确保Notion集成中的重定向URI与环境变量中的完全匹配
   - 注意HTTP/HTTPS协议

3. **获取token失败**
   - 检查Client Secret是否正确
   - 确认授权码没有过期
   - 查看Vercel函数日志

4. **环境变量未生效**
   - Vercel部署后需要重新部署才能应用新的环境变量
   - 检查变量名称是否与代码中一致

### 查看日志

在Vercel控制台的 "Functions" 标签页可以查看API请求日志，有助于调试问题。

## 安全注意事项

1. **保护敏感信息**
   - 永远不要在客户端代码中暴露Client Secret
   - 使用环境变量存储所有敏感配置

2. **HTTPS要求**
   - 生产环境必须使用HTTPS
   - Vercel自动提供SSL证书

3. **Token安全**
   - 获取的access token具有用户授权的权限
   - 请妥善保管和使用token

## 自定义配置

### 修改样式
编辑 `pages/index.js` 和 `pages/success.js` 中的样式部分。

### 添加功能
可以在成功页面添加更多Notion API调用，如获取数据库列表等。

### 环境变量
根据需要添加更多环境变量来配置应用行为。 