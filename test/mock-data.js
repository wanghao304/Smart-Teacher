// test/mock-data.js
// 模拟测试数据生成器

/**
 * 生成10个测试用户
 */
const mockUsers = [
    {
        id: 'user_001',
        nickname: '张三',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'INTJ',
        execution_style: { decision: 'data-driven', action: 8 },
        resources: { budget: { min: 50000, max: 100000 }, time: 20 },
        cognition_level: 7
    },
    {
        id: 'user_002',
        nickname: '李四',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ENFP',
        execution_style: { decision: 'intuitive', action: 6 },
        resources: { budget: { min: 20000, max: 50000 }, time: 10 },
        cognition_level: 5
    },
    {
        id: 'user_003',
        nickname: '王五',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ISTJ',
        execution_style: { decision: 'conservative', action: 7 },
        resources: { budget: { min: 100000, max: 200000 }, time: 30 },
        cognition_level: 8
    },
    {
        id: 'user_004',
        nickname: '赵六',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ESTP',
        execution_style: { decision: 'adventurous', action: 9 },
        resources: { budget: { min: 10000, max: 30000 }, time: 15 },
        cognition_level: 6
    },
    {
        id: 'user_005',
        nickname: '钱七',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'INFJ',
        execution_style: { decision: 'balanced', action: 7 },
        resources: { budget: { min: 80000, max: 150000 }, time: 25 },
        cognition_level: 7
    },
    {
        id: 'user_006',
        nickname: '孙八',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ENTP',
        execution_style: { decision: 'innovative', action: 8 },
        resources: { budget: { min: 60000, max: 120000 }, time: 20 },
        cognition_level: 8
    },
    {
        id: 'user_007',
        nickname: '周九',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ISFP',
        execution_style: { decision: 'artistic', action: 5 },
        resources: { budget: { min: 30000, max: 60000 }, time: 12 },
        cognition_level: 5
    },
    {
        id: 'user_008',
        nickname: '吴十',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ESTJ',
        execution_style: { decision: 'practical', action: 9 },
        resources: { budget: { min: 150000, max: 300000 }, time: 40 },
        cognition_level: 9
    },
    {
        id: 'user_009',
        nickname: '郑十一',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'INFP',
        execution_style: { decision: 'idealistic', action: 6 },
        resources: { budget: { min: 40000, max: 80000 }, time: 18 },
        cognition_level: 6
    },
    {
        id: 'user_010',
        nickname: '王十二',
        avatarUrl: 'https://via.placeholder.com/150',
        personality_type: 'ENTJ',
        execution_style: { decision: 'strategic', action: 9 },
        resources: { budget: { min: 200000, max: 500000 }, time: 50 },
        cognition_level: 9
    }
];

/**
 * 生成导师数据
 */
const mockMentors = [
    {
        id: 'mentor_001',
        name: '马云',
        field: '电商创业',
        type: 'macro',
        is_celebrity: true,
        philosophy: '让天下没有难做的生意',
        success_model: { vision: '顶层战略', execution: '生态构建' }
    },
    {
        id: 'mentor_002',
        name: '雷军',
        field: '科技产品',
        type: 'macro',
        is_celebrity: true,
        philosophy: '专注、极致、口碑、快',
        success_model: { vision: '互联网思维', execution: '性价比' }
    },
    {
        id: 'mentor_003',
        name: '张三丰（本地咖啡店主）',
        field: '餐饮零售',
        type: 'tactical',
        is_celebrity: false,
        philosophy: '服务为本，品质为王',
        success_model: { vision: '社区经营', execution: '精细化管理' }
    },
    {
        id: 'mentor_004',
        name: '李佳琦',
        field: '直播电商',
        type: 'tactical',
        is_celebrity: true,
        philosophy: 'OMG，买它！',
        success_model: { vision: '流量变现', execution: '选品+话术' }
    },
    {
        id: 'mentor_005',
        name: '王小川',
        field: 'AI科技',
        type: 'macro',
        is_celebrity: true,
        philosophy: '技术改变生活',
        success_model: { vision: '技术驱动', execution: '产品创新' }
    }
];

/**
 * 生成项目数据
 */
const mockProjects = [
    {
        id: 'project_001',
        user_id: 'user_001',
        name: '开一家智能咖啡店',
        description: '利用AI技术打造智能化咖啡体验',
        goal: '3个月内开业，半年内实现盈利',
        status: 'active',
        completion_percentage: 35,
        current_score: 7.5,
        mentor_ids: ['mentor_001', 'mentor_003']
    },
    {
        id: 'project_002',
        user_id: 'user_002',
        name: '策划汽车品牌推广活动',
        description: '为新能源汽车品牌策划线上线下推广',
        goal: '触达100万+潜在用户',
        status: 'planning',
        completion_percentage: 15,
        current_score: 6.0,
        mentor_ids: ['mentor_002']
    },
    {
        id: 'project_003',
        user_id: 'user_003',
        name: '开设抖音直播账号',
        description: '通过直播带货实现副业收入',
        goal: '3个月粉丝破10万',
        status: 'active',
        completion_percentage: 60,
        current_score: 8.5,
        mentor_ids: ['mentor_004']
    }
];

/**
 * 生成任务数据
 */
const mockTasks = [
    {
        id: 'task_001',
        project_id: 'project_001',
        user_id: 'user_001',
        title: '完成选址调研',
        description: '调研3个以上商圈的人流量和租金',
        status: 'completed',
        priority: 'high',
        deadline: new Date('2025-11-25').toISOString()
    },
    {
        id: 'task_002',
        project_id: 'project_001',
        user_id: 'user_001',
        title: '与供应商洽谈',
        description: '联系咖啡豆供应商，确定合作方案',
        status: 'in_progress',
        priority: 'high',
        deadline: new Date('2025-11-28').toISOString()
    },
    {
        id: 'task_003',
        project_id: 'project_002',
        user_id: 'user_002',
        title: '制定推广方案',
        description: '撰写详细的推广策划书',
        status: 'pending',
        priority: 'normal',
        deadline: new Date('2025-12-01').toISOString()
    }
];

/**
 * 生成对话消息数据
 */
const mockChatMessages = [
    {
        id: 'msg_001',
        user_id: 'user_001',
        session_id: 'session_001',
        role: 'user',
        content: '我想开一家咖啡店，但只有10万启动资金，怎么办？',
        tokens_used: 150
    },
    {
        id: 'msg_002',
        user_id: 'user_001',
        session_id: 'session_001',
        role: 'assistant',
        content: '根据您的情况，我建议采取以下策略：\n1. 选择小型店面（20-30平米）\n2. 使用二手设备降低成本\n3. 主打外卖，减少堂食成本\n4. 初期自己运营，无需雇人',
        tokens_used: 200
    }
];

module.exports = {
    mockUsers,
    mockMentors,
    mockProjects,
    mockTasks,
    mockChatMessages
};
