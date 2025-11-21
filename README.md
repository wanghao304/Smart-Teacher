# Smart Teacher (智导) - 微信小程序开发指南

## 📁 项目结构

```
Smart Teacher/
├── PRD.md                    # 产品需求文档
├── README.md                 # 项目说明文档
├── miniprogram-clean/        # 微信小程序源码（主项目）
├── miniprogram/              # 微信小程序源码（旧版本）
│   ├── app.js                # 小程序入口
│   ├── app.json              # 全局配置
│   ├── app.wxss              # 全局样式
│   ├── pages/                # 页面目录
│   │   ├── index/            # 首页
│   │   ├── profile/          # 用户档案
│   │   ├── mentor/           # 导师管理
│   │   ├── project/          # 项目管理
│   │   ├── calendar/         # 日历/任务
│   │   ├── share/            # 分享页面
│   │   ├── chat/             # AI对话
│   │   └── membership/       # 会员中心
│   ├── components/           # 组件目录
│   ├── utils/                # 工具函数
│   │   ├── api.js            # API封装
│   │   └── util.js           # 通用工具
│   ├── images/               # 图片资源
│   └── styles/               # 样式文件
├── admin/                    # 管理员后台
│   └── index.html            # 后台管理界面
└── database/                 # 数据库
    └── schema.sql            # 数据库表结构
```

## 🚀 快速开始

### 1. 环境准备

**必需工具：**
- **微信开发者工具** (最新版) - [下载地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **Supabase账号** - [注册地址](https://supabase.com/)
- **豆包AI API密钥** (已配置在代码中)

### 2. 配置数据库

**步骤一：登录Supabase**
1. 访问 https://supabase.com/dashboard/project/abigvhvncuaajpesfagy
2. 使用邮箱 `evanmgpts@gmail.com` 登录

**步骤二：创建数据表**
1. 点击左侧菜单 "SQL Editor"
2. 点击 "New Query"
3. 复制 `database/schema.sql` 中的全部SQL代码
4. 粘贴到编辑器并点击 "Run" 执行

**步骤三：获取API密钥**
1. 点击左侧菜单 "Settings" → "API"
2. 复制 `anon public` 密钥
3. 打开 `miniprogram-clean/app.js`，将密钥填入 `apiKey` 字段：
```javascript
globalData: {
  apiBaseUrl: 'https://abigvhvncuaajpesfagy.supabase.co',
  apiKey: '你的Supabase_API_Key', // ← 替换这里
  // ...
}
```

### 3. 导入小程序项目

1. 打开微信开发者工具
2. 点击 "导入项目"
3. 项目目录选择：`E:\Smart Teacher\miniprogram-clean`
4. AppID填写你的小程序AppID（测试环境可使用测试号）
5. 点击 "导入"

### 4. 本地预览

1. 在微信开发者工具中点击 "编译"
2. 查看模拟器预览效果
3. 点击 "预览" 可生成二维码，手机扫码真机测试

## 🔧 核心功能实现说明

### 一、全维档案采集

**文件位置：** `pages/profile/profile.js`

**实现逻辑：**
1. 通过多步骤表单采集用户信息
2. 使用AI生成个性化测试题
3. 数据存储到Supabase `profiles` 表
4. 本地缓存提升体验

### 二、导师智能体

**文件位置：** `pages/mentor/mentor.js`

**实现逻辑：**
1. 用户输入导师名称
2. 调用豆包API搜索公开资料
3. AI提炼导师思维模型
4. 存储到 `mentors` 表
5. 推荐算法匹配用户画像

### 三、项目执行与评分

**文件位置：** `pages/project/project.js`

**核心流程：**
```javascript
// 1. 用户上报进度
projectAPI.updateProgress(projectId, {
  content: '今天完成了XX',
  attachments: ['图片URL']
});

// 2. AI调用导师智能体评分
const evaluation = await projectAPI.evaluateProject(projectData, mentors);

// 3. 根据评分触发不同反馈
if (evaluation.totalScore >= 9) {
  // 收录成功案例
} else if (evaluation.totalScore >= 4) {
  // 提供修正建议
} else {
  // 启动手把手教学
}
```

### 四、日历与提醒

**文件位置：** `pages/calendar/calendar.js`

**核心功能：**
1. 任务自动同步到日历视图
2. 使用微信订阅消息推送提醒
3. 支持导出到系统日历（通过生成 `.ics` 文件）

**配置订阅消息：**
1. 登录微信公众平台
2. 功能 → 订阅消息 → 选择模板
3. 将模板ID填入 `utils/api.js` 的 `taskAPI.setReminder` 方法

### 五、分享与协作

**文件位置：** `pages/share/share.js`

**分享机制：**
```javascript
// 生成分享链接
const { shareCode, url } = await shareAPI.generateLink(projectId, 'member');

// 小程序分享
onShareAppMessage: function() {
  return {
    title: '加入我的项目',
    path: url,
    imageUrl: '/images/share-banner.png'
  };
}
```

**奖励逻辑：**
- 新用户通过链接注册 → 记录邀请关系
- 后台定时任务检查邀请状态
- 自动发放奖励（额外对话次数/会员延期）

### 六、实时反馈与导师评估

**核心代码示例：**
```javascript
// 圆桌会议模式
const discussion = await chatAPI.mentorRoundtable(
  "我想开一家咖啡店，启动资金只有10万，怎么办？",
  mentors // 用户的导师团队
);

// AI模拟多位导师观点
// "宏观导师（星巴克创始人）：先验证商业模式..."
// "实战导师（本地咖啡店主）：10万可以做快闪店测试..."
// "综合建议：优先选择..."
```

## 🎨 UI设计规范

### 颜色系统
```css
--primary-color: #6366f1;      /* 主色（紫蓝色） */
--success-color: #10b981;      /* 成功绿 */
--warning-color: #f59e0b;      /* 警告橙 */
--danger-color: #ef4444;       /* 危险红 */
```

### 组件命名
- 卡片：`.card`
- 按钮：`.btn .btn-primary`
- 标签：`.tag .tag-success`

### 响应式适配
所有尺寸使用 `rpx`（responsive pixel），自动适配不同屏幕。

## 🔐 管理员后台使用

### 访问方式
1. 部署 `admin/index.html` 到Vercel或其他静态托管
2. 访问URL（例如：https://smart-teacher-admin.vercel.app）
3. 使用超级管理员账号登录：
   - 账号：`wanghao304`
   - 密码：`lm888456`

### 主要功能
- **数据总览**：查看DAU、MAU、收入等关键指标
- **用户管理**：查看/编辑/封禁用户
- **内容审核**：审核导师资料、分享海报
- **财务管理**：查看收入报表、Token成本
- **系统配置**：调整会员定价、API密钥等

## 📊 数据库表说明

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| profiles | 用户档案 | personality_type, resources, skills |
| mentors | 导师信息 | name, field, success_model |
| projects | 项目 | name, status, completion_percentage |
| tasks | 任务 | title, deadline, priority |
| share_links | 分享链接 | share_code, role |
| invites | 邀请记录 | inviter_id, reward_status |
| memberships | 会员 | tier, end_date, daily_usage |

## 🧪 测试流程

### 本地测试
1. 在模拟器中依次测试各个功能模块
2. 检查控制台是否有报错
3. 验证数据是否正确存储到Supabase

### 真机测试
1. 点击 "预览" 生成二维码
2. 使用微信扫码
3. 测试分享、支付、订阅消息等手机特有功能

### 提交审核前检查
- [ ] 所有页面可正常访问
- [ ] API密钥已正确配置
- [ ] 隐私政策、用户协议已补充
- [ ] 订阅消息模板已申请
- [ ] 支付功能已对接（如需要）

## 🚀 部署上线

### 小程序端
1. 在微信开发者工具点击 "上传"
2. 填写版本号和更新说明
3. 登录微信公众平台提交审核
4. 审核通过后发布

### 管理后台
```bash
# 使用Vercel部署
cd "e:/Smart Teacher/admin"
vercel --prod
```

### 数据库
Supabase已部署在云端，无需额外操作。

## ⚠️ 注意事项

1. **API密钥安全**：
   - 不要将豆包API密钥暴露在前端代码
   - 建议通过后端中转（Supabase Edge Functions）

2. **用户隐私**：
   - 采集用户数据前需获得授权
   - 遵守《个人信息保护法》

3. **费用控制**：
   - 监控豆包API调用次数
   - 设置每日调用上限

4. **备份机制**：
   - 定期备份Supabase数据库
   - 重要用户数据多地存储

## 📞 技术支持

**项目负责人：** wanghao304  
**邮箱：** wanghao_2003@hotmail.com  
**GitHub：** https://github.com/wanghao304/Smart-Teacher

## 📝 更新日志

### v1.0.1 (2025-11-21)
- ✅ 修复聊天页面语法错误
- ✅ 修复登录逻辑（移除错误的Supabase OAuth调用）
- ✅ 优化微信登录流程
- ✅ 完善错误处理机制

### v1.0.0 (2025-11-21)
- ✅ 完成核心功能框架搭建
- ✅ 实现全维档案采集
- ✅ 实现导师智能体系统
- ✅ 实现项目执行与评分
- ✅ 实现日历提醒机制
- ✅ 实现分享与协作功能
- ✅ 完成管理员后台
- ✅ 对接豆包AI API
- ✅ 配置Supabase数据库

### 待实现功能
- [ ] 支付功能对接
- [ ] 高级数据分析
- [ ] 导师知识库RAG检索
- [ ] H5端与Web端适配

---

**开发愉快！有任何问题请查阅文档或联系技术支持。** 🚀
