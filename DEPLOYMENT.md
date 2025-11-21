# 部署指南

## 📦 GitHub 仓库

**仓库地址：** https://github.com/wanghao304/Smart-Teacher

**账号信息：**
- GitHub 账号：wanghao304
- 邮箱：wanghao_2003@hotmail.com

## 🚀 Vercel 部署

### 账号信息
- Vercel 账号：wanghao-2003-5326
- 邮箱：wanghao_2003@hotmail.com
- 项目名：smart-teacher
- 项目地址：https://vercel.com/wanghao304s-projects/smart-teacher

### 部署步骤

#### 方法一：通过 Vercel 网站部署（推荐）

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用邮箱 `wanghao_2003@hotmail.com` 登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择 GitHub 仓库：`wanghao304/Smart-Teacher`
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Other
   - **Root Directory**: `./admin` (管理后台) 或留空（使用根目录）
   - **Build Command**: 留空（静态文件无需构建）
   - **Output Directory**: 留空

4. **环境变量（如需要）**
   - 在 "Environment Variables" 中添加：
     - `SUPABASE_URL`: `https://abigvhvncuaajpesfagy.supabase.co`
     - `SUPABASE_KEY`: (你的 Supabase API Key)

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - 访问生成的 URL（例如：https://smart-teacher.vercel.app）

#### 方法二：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署到生产环境**
   ```bash
   cd "E:\Smart Teacher"
   vercel --prod
   ```

4. **后续更新**
   ```bash
   git push origin main
   # Vercel 会自动检测 GitHub 推送并重新部署
   ```

### 配置自动部署

1. **连接 GitHub 仓库**
   - 在 Vercel 项目设置中，确保已连接 GitHub 仓库
   - 启用 "Automatic Deployments"

2. **分支设置**
   - Production Branch: `main`
   - Preview Branches: `*` (所有分支)

3. **部署钩子（可选）**
   - 在 Vercel 项目设置 → Deploy Hooks 中创建部署钩子
   - 可用于 CI/CD 流程

## 🗄️ Supabase 数据库

### 账号信息
- Supabase 账号：evanmgpts-commits
- 邮箱：evanmgpts@gmail.com
- 项目名：smart teacher
- 项目地址：https://supabase.com/dashboard/project/abigvhvncuaajpesfagy

### 数据库配置

1. **登录 Supabase**
   - 访问 https://supabase.com/dashboard/project/abigvhvncuaajpesfagy
   - 使用邮箱 `evanmgpts@gmail.com` 登录

2. **API 密钥**
   - 在 Settings → API 中查看：
     - Project URL: `https://abigvhvncuaajpesfagy.supabase.co`
     - anon public key: (已配置在 `miniprogram-clean/app.js` 中)

3. **数据库表**
   - 执行 `database/schema.sql` 创建所有表结构
   - 或通过 SQL Editor 手动创建

## 📱 微信小程序部署

### 上传代码

1. **打开微信开发者工具**
   - 导入项目：`E:\Smart Teacher\miniprogram-clean`
   - 填写 AppID

2. **上传版本**
   - 点击工具栏 "上传"
   - 填写版本号和项目备注
   - 点击 "上传"

3. **提交审核**
   - 登录 [微信公众平台](https://mp.weixin.qq.com)
   - 版本管理 → 开发版本 → 选择版本 → 提交审核
   - 填写审核信息

4. **发布上线**
   - 审核通过后，点击 "发布"
   - 小程序正式上线

### 版本管理

- **开发版本**：开发者上传的代码版本
- **体验版本**：供体验者测试的版本
- **审核版本**：提交审核的版本
- **线上版本**：正式发布的版本

## 🔄 持续集成/持续部署 (CI/CD)

### GitHub Actions（可选）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📝 部署检查清单

### 部署前检查
- [ ] 代码已推送到 GitHub
- [ ] 所有环境变量已配置
- [ ] API 密钥已正确设置
- [ ] 数据库表结构已创建
- [ ] 测试所有功能是否正常

### 部署后检查
- [ ] 访问 Vercel 部署的 URL 确认可访问
- [ ] 检查控制台是否有错误
- [ ] 测试 API 连接是否正常
- [ ] 验证数据库连接
- [ ] 检查静态资源加载

## 🐛 常见问题

### Vercel 部署失败
- 检查 `vercel.json` 配置是否正确
- 确认根目录路径是否正确
- 查看 Vercel 部署日志

### 数据库连接失败
- 检查 Supabase API 密钥是否正确
- 确认网络连接正常
- 检查 Supabase 项目是否正常运行

### 小程序上传失败
- 检查 AppID 是否正确
- 确认代码没有语法错误
- 查看微信开发者工具控制台

## 📞 技术支持

如有部署问题，请联系：
- **邮箱**：wanghao_2003@hotmail.com
- **GitHub**：https://github.com/wanghao304/Smart-Teacher

