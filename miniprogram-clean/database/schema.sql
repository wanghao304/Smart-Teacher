-- Supabase 数据库表结构定义 (SQL)
-- Smart Teacher 微信小程序数据库
-- 简化版：暂时禁用RLS，方便开发测试

-- 用户档案表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) UNIQUE NOT NULL,
  nickname VARCHAR(100),
  avatar_url TEXT,
  
  -- 心理与人格
  personality_type VARCHAR(50),
  personality_traits JSONB,
  
  -- 做事风格
  execution_style JSONB,
  decision_preference VARCHAR(50),
  action_level INTEGER,
  
  -- 资源盘点
  resources JSONB,
  skills JSONB,
  budget JSONB,
  
  -- 认知边界
  cognition_level INTEGER,
  
  -- 元数据
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 导师表
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  field VARCHAR(100),
  type VARCHAR(20), -- 'macro' 或 'tactical'
  
  -- 导师信息
  is_celebrity BOOLEAN DEFAULT FALSE,
  bio TEXT,
  philosophy TEXT,
  success_model JSONB,
  
  -- 知识库
  knowledge_base JSONB,
  reference_materials JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  goal TEXT,
  
  -- 项目状态
  status VARCHAR(20) DEFAULT 'planning', -- planning/active/paused/completed
  completion_percentage INTEGER DEFAULT 0,
  current_score DECIMAL(3,1) DEFAULT 0,
  
  -- 时间线
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  
  -- 资源配置
  budget_allocated DECIMAL(10,2),
  time_allocated INTEGER, -- 小时
  
  -- 关联导师
  mentor_ids JSONB,
  
  -- 协作信息
  is_collaborative BOOLEAN DEFAULT FALSE,
  collaborators JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 项目日志表
CREATE TABLE IF NOT EXISTS project_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  user_id VARCHAR(100) NOT NULL,
  
  -- 日志内容
  log_type VARCHAR(20), -- progress/feedback/evaluation
  content TEXT,
  attachments JSONB,
  
  -- AI评估
  ai_evaluation JSONB,
  score DECIMAL(3,1),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 任务表
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  user_id VARCHAR(100) NOT NULL,
  
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- 任务状态
  status VARCHAR(20) DEFAULT 'pending', -- pending/in_progress/completed/overdue
  priority VARCHAR(20) DEFAULT 'normal', -- high/normal/low
  
  -- 时间
  deadline TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- 提醒设置
  reminders JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 分享链接表
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  share_code VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20), -- owner/member/observer
  
  -- 使用统计
  click_count INTEGER DEFAULT 0,
  join_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- 邀请记录表
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_id VARCHAR(100) NOT NULL,
  invited_user_id VARCHAR(100),
  
  -- 奖励状态
  reward_status VARCHAR(20) DEFAULT 'pending', -- pending/awarded/expired
  reward_type VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  awarded_at TIMESTAMP
);

-- 会员记录表
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) UNIQUE NOT NULL,
  
  -- 会员信息
  tier VARCHAR(20) DEFAULT 'free', -- free/pro/premium
  start_date DATE,
  end_date DATE,
  
  -- 使用统计
  daily_usage INTEGER DEFAULT 0,
  total_usage INTEGER DEFAULT 0,
  last_reset_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 对话历史表
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) NOT NULL,
  session_id VARCHAR(100),
  
  role VARCHAR(20), -- user/assistant/system
  content TEXT,
  tokens_used INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_invites_inviter_id ON invites(inviter_id);

-- 注意：RLS（行级安全）策略已暂时禁用
-- 原因：微信小程序使用自定义认证，不使用Supabase Auth
-- 开发测试阶段先禁用RLS，生产环境需要根据实际认证方案配置
-- 
-- 如需启用RLS，请在生产环境中根据实际情况配置策略
