# Supabase 配置与初始化指南

## ✅ 配置信息（已完成）

### 项目信息
- **项目URL**: https://abigvhvncuaajpesfagy.supabase.co
- **项目名称**: smart teacher
- **邮箱**: evanmgpts@gmail.com

### API密钥（已配置到代码）
- ✅ **Anon Public Key**: 已配置到 `miniprogram/app.js`
- ✅ 小程序现在可以与数据库交互

---

## ⚠️ 下一步：初始化数据库（必需）

### 步骤1：登录Supabase

1. 访问：https://supabase.com/dashboard/project/abigvhvncuaajpesfagy
2. 使用邮箱登录：evanmgpts@gmail.com

### 步骤2：打开SQL Editor

1. 在左侧菜单点击 **SQL Editor**
2. 点击 **New Query**（新建查询）

### 步骤3：执行初始化SQL

**方法一：复制粘贴（推荐）**
1. 打开文件：`database/schema.sql`
2. 复制全部内容（约200行SQL代码）
3. 粘贴到SQL Editor中
4. 点击右下角 **Run**（运行）按钮
5. 等待执行完成（约5-10秒）

**方法二：逐表执行**
如果一次性执行失败，可以分段执行：
```sql
-- 先执行创建表的部分
CREATE TABLE IF NOT EXISTS profiles (...);
CREATE TABLE IF NOT EXISTS mentors (...);
-- ... 其他表

-- 再执行创建索引的部分
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
-- ... 其他索引

-- 最后执行RLS策略的部分
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ... 其他策略
```

### 步骤4：验证表创建成功

1. 在左侧菜单点击 **Table Editor**
2. 应该能看到以下10张表：
   - ✅ profiles
   - ✅ mentors
   - ✅ projects
   - ✅ project_logs
   - ✅ tasks
   - ✅ share_links
   - ✅ invites
   - ✅ memberships
   - ✅ chat_messages
   - ✅ system_config

如果看到这10张表，说明初始化成功！✅

---

## 🔒 安全配置（可选，但建议）

### 行级安全策略（RLS）

RLS已经在SQL中启用，但您可能需要根据实际情况调整策略。

**当前策略**：
- ✅ profiles: 用户只能访问自己的档案
- ✅ mentors: 用户只能访问自己的导师
- ✅ projects: 用户只能访问自己的项目
- ✅ chat_messages: 用户只能访问自己的消息

**调整策略**：
1. Table Editor → 选择表 → Policies
2. 可以添加更细粒度的策略

---

## 🧪 测试数据库连接

### 方法一：使用Supabase API Explorer

1. 左侧菜单 → **API**
2. 选择 **profiles** 表
3. 点击 **Send**，测试GET请求
4. 如果返回200（即使返回空数组），说明连接正常

### 方法二：在小程序中测试

```javascript
// 在小程序中任意页面的onLoad中添加
const { profileAPI } = require('../../utils/api.js');

profileAPI.get('test_user_001')
  .then(data => {
    console.log('数据库连接成功！', data);
  })
  .catch(error => {
    console.error('数据库连接失败：', error);
  });
```

---

## 📊 数据库表结构说明

### 核心表

#### 1. profiles（用户档案表）
存储用户的全维档案信息
- user_id: 用户ID
- personality_type: 人格类型（MBTI）
- execution_style: 做事风格
- resources: 资源盘点
- cognition_level: 认知水平

#### 2. mentors（导师表）
存储用户添加的导师信息
- user_id: 用户ID
- name: 导师姓名
- field: 专业领域
- type: 类型（macro/tactical）
- is_celebrity: 是否名人

#### 3. projects（项目表）
存储用户的项目
- user_id: 用户ID
- name: 项目名称
- status: 状态（planning/active/completed）
- completion_percentage: 完成百分比
- current_score: 当前评分

#### 4. tasks（任务表）
存储项目的任务
- project_id: 项目ID
- title: 任务标题
- deadline: 截止日期
- status: 状态（pending/in_progress/completed）

#### 5. chat_messages（对话历史表）
存储AI对话记录
- user_id: 用户ID
- role: 角色（user/assistant）
- content: 内容
- tokens_used: Token消耗

#### 6. memberships（会员表）
存储用户会员信息
- user_id: 用户ID
- tier: 会员等级（free/pro）
- daily_usage: 每日使用量

#### 7-10. 其他辅助表
- project_logs: 项目日志
- share_links: 分享链接
- invites: 邀请记录
- system_config: 系统配置

---

## ⚡ 性能优化建议

### 已创建的索引
- ✅ profiles(user_id)
- ✅ mentors(user_id)
- ✅ projects(user_id)
- ✅ tasks(project_id, user_id)
- ✅ chat_messages(user_id)

### 如需更多优化
```sql
-- 复合索引示例
CREATE INDEX idx_projects_user_status 
ON projects(user_id, status);

-- 全文搜索索引（如需搜索功能）
CREATE INDEX idx_mentors_name_trgm 
ON mentors USING gin(name gin_trgm_ops);
```

---

## 🔧 常见问题排查

### 问题1：SQL执行失败
**可能原因**：
- 表已存在
- 权限不足

**解决方案**：
```sql
-- 删除所有表（谨慎！）
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS mentors CASCADE;
-- ... 其他表

-- 然后重新执行schema.sql
```

### 问题2：小程序无法连接数据库
**检查清单**：
- ✅ API密钥是否正确配置
- ✅ 表是否创建成功
- ✅ RLS策略是否过于严格
- ✅ 网络是否正常

**调试方法**：
```javascript
// 查看详细错误
wx.request({
  url: 'https://abigvhvncuaajpesfagy.supabase.co/rest/v1/profiles',
  header: {
    'apikey': '你的密钥',
    'Authorization': 'Bearer 你的密钥'
  },
  success: (res) => console.log('成功', res),
  fail: (err) => console.error('失败', err)
});
```

### 问题3：RLS策略拦截请求
**临时解决**（仅用于开发测试）：
```sql
-- 禁用RLS（不推荐生产环境）
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**正确解决**：
调整RLS策略以适配您的需求

---

## ✅ 配置完成检查清单

- [x] Supabase API密钥已配置到代码
- [ ] 数据库表已创建（需要您执行SQL）
- [ ] 数据库连接测试通过
- [ ] RLS策略已验证

---

## 📞 需要帮助？

如果遇到问题：
1. 查看Supabase Dashboard的Logs（日志）
2. 检查SQL Editor的错误提示
3. 查看小程序控制台的网络请求

---

**配置完成后，系统即可100%运行！** 🚀

最后更新：2025-11-21 13:52
