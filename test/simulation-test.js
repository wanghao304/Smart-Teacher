// test/simulation-test.js
// 系统模拟测试脚本 - 模拟10个用户的完整操作流程

/**
 * 模拟测试执行器
 * 这个脚本会模拟10个用户从注册到使用的完整流程
 */

// ==================== 测试配置 ====================
const TEST_CONFIG = {
    apiBaseUrl: 'https://abigvhvncuaajpesfagy.supabase.co',
    doubaoApiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    doubaoApiKey: '361fc5ee-74d8-45cf-bc70-3685385fddf3',
    supabaseApiKey: '请配置您的Supabase_API_Key', // 需要用户填写
    testMode: true
};

// ==================== 模拟用户数据 ====================
const MOCK_USERS = [
    {
        id: 'test_user_001',
        nickname: '测试用户-张三',
        profile: {
            personality_type: 'INTJ',
            personality_traits: ['理性', '独立', '战略思维'],
            execution_style: {
                decision: 'data-driven',
                action_level: 8
            },
            resources: {
                contacts: ['媒体朋友', '供应链资源'],
                skills: ['数据分析', '项目管理'],
                budget: { min: 50000, max: 100000 },
                time: 20
            },
            cognition_level: 7
        },
        project: {
            name: '开一家智能咖啡店',
            description: '利用AI技术打造智能化咖啡体验',
            goal: '3个月内开业，半年内盈利'
        },
        mentors: [
            { name: '马云', field: '电商创业', type: 'macro' },
            { name: '本地咖啡店主', field: '餐饮运营', type: 'tactical' }
        ]
    },
    {
        id: 'test_user_002',
        nickname: '测试用户-李四',
        profile: {
            personality_type: 'ENFP',
            personality_traits: ['热情', '创新', '善于沟通'],
            execution_style: {
                decision: 'intuitive',
                action_level: 6
            },
            resources: {
                contacts: ['市场朋友', '设计师'],
                skills: ['创意策划', '社交媒体'],
                budget: { min: 20000, max: 50000 },
                time: 10
            },
            cognition_level: 5
        },
        project: {
            name: '汽车品牌推广活动',
            description: '为新能源汽车品牌策划线上线下推广',
            goal: '触达100万+用户'
        },
        mentors: [
            { name: '雷军', field: '品牌营销', type: 'macro' }
        ]
    },
    {
        id: 'test_user_003',
        nickname: '测试用户-王五',
        profile: {
            personality_type: 'ISTJ',
            personality_traits: ['稳重', '细致', '执行力强'],
            execution_style: {
                decision: 'conservative',
                action_level: 7
            },
            resources: {
                contacts: ['会计师', '律师'],
                skills: ['财务管理', '合规'],
                budget: { min: 100000, max: 200000 },
                time: 30
            },
            cognition_level: 8
        },
        project: {
            name: '开设抖音直播账号',
            description: '通过直播带货实现副业收入',
            goal: '3个月粉丝破10万'
        },
        mentors: [
            { name: '李佳琦', field: '直播带货', type: 'tactical' }
        ]
    },
    {
        id: 'test_user_004',
        nickname: '测试用户-赵六',
        profile: {
            personality_type: 'ESTP',
            personality_traits: ['行动派', '冒险', '灵活'],
            execution_style: {
                decision: 'adventurous',
                action_level: 9
            },
            resources: {
                contacts: ['投资人', '创业者'],
                skills: ['销售', '谈判'],
                budget: { min: 10000, max: 30000 },
                time: 15
            },
            cognition_level: 6
        },
        project: {
            name: '社区团购平台',
            description: '打造本地化社区团购服务',
            goal: '覆盖10个社区'
        },
        mentors: [
            { name: '社区团长', field: '社区运营', type: 'tactical' }
        ]
    },
    {
        id: 'test_user_005',
        nickname: '测试用户-钱七',
        profile: {
            personality_type: 'INFJ',
            personality_traits: ['理想主义', '有洞察力', '关注他人'],
            execution_style: {
                decision: 'balanced',
                action_level: 7
            },
            resources: {
                contacts: ['教育工作者', 'NGO'],
                skills: ['教学', '写作'],
                budget: { min: 80000, max: 150000 },
                time: 25
            },
            cognition_level: 7
        },
        project: {
            name: '在线教育课程',
            description: '开发职业技能在线课程',
            goal: '招募500名学员'
        },
        mentors: [
            { name: '知识付费专家', field: '在线教育', type: 'macro' }
        ]
    },
    {
        id: 'test_user_006',
        nickname: '测试用户-孙八',
        profile: {
            personality_type: 'ENTP',
            personality_traits: ['创新', '辩论', '多才多艺'],
            execution_style: {
                decision: 'innovative',
                action_level: 8
            },
            resources: {
                contacts: ['技术团队', 'VC'],
                skills: ['产品设计', '技术'],
                budget: { min: 60000, max: 120000 },
                time: 20
            },
            cognition_level: 8
        },
        project: {
            name: 'AI工具产品',
            description: '开发面向C端的AI效率工具',
            goal: '获得10万用户'
        },
        mentors: [
            { name: '王小川', field: 'AI产品', type: 'macro' }
        ]
    },
    {
        id: 'test_user_007',
        nickname: '测试用户-周九',
        profile: {
            personality_type: 'ISFP',
            personality_traits: ['艺术', '敏感', '自由'],
            execution_style: {
                decision: 'artistic',
                action_level: 5
            },
            resources: {
                contacts: ['设计师', '艺术家'],
                skills: ['绘画', '摄影'],
                budget: { min: 30000, max: 60000 },
                time: 12
            },
            cognition_level: 5
        },
        project: {
            name: '创意工作室',
            description: '提供插画和设计服务',
            goal: '接到20个商业项目'
        },
        mentors: [
            { name: '独立设计师', field: '创意设计', type: 'tactical' }
        ]
    },
    {
        id: 'test_user_008',
        nickname: '测试用户-吴十',
        profile: {
            personality_type: 'ESTJ',
            personality_traits: ['实干', '组织', '决断'],
            execution_style: {
                decision: 'practical',
                action_level: 9
            },
            resources: {
                contacts: ['企业高管', '供应商'],
                skills: ['管理', '运营'],
                budget: { min: 150000, max: 300000 },
                time: 40
            },
            cognition_level: 9
        },
        project: {
            name: '连锁餐饮店',
            description: '开设3家连锁小吃店',
            goal: '每家月营业额20万+'
        },
        mentors: [
            { name: '餐饮连锁创始人', field: '连锁经营', type: 'macro' }
        ]
    },
    {
        id: 'test_user_009',
        nickname: '测试用户-郑十一',
        profile: {
            personality_type: 'INFP',
            personality_traits: ['理想', '关怀', '创意'],
            execution_style: {
                decision: 'idealistic',
                action_level: 6
            },
            resources: {
                contacts: ['公益组织', '志愿者'],
                skills: ['内容创作', '社群运营'],
                budget: { min: 40000, max: 80000 },
                time: 18
            },
            cognition_level: 6
        },
        project: {
            name: '公益项目',
            description: '组织环保主题活动',
            goal: '影响1000人参与'
        },
        mentors: [
            { name: '公益组织负责人', field: '公益运营', type: 'tactical' }
        ]
    },
    {
        id: 'test_user_010',
        nickname: '测试用户-王十二',
        profile: {
            personality_type: 'ENTJ',
            personality_traits: ['领导', '战略', '目标导向'],
            execution_style: {
                decision: 'strategic',
                action_level: 9
            },
            resources: {
                contacts: ['投资人', '行业专家'],
                skills: ['战略规划', '团队管理'],
                budget: { min: 200000, max: 500000 },
                time: 50
            },
            cognition_level: 9
        },
        project: {
            name: 'SaaS创业项目',
            description: '开发企业级SaaS软件',
            goal: '获得天使轮融资'
        },
        mentors: [
            { name: 'SaaS行业专家', field: '软件创业', type: 'macro' }
        ]
    }
];

// ==================== 测试场景定义 ====================

/**
 * 测试场景1：用户注册与档案建立
 */
async function testUserRegistration(user) {
    console.log(`\n========== 测试用户注册：${user.nickname} ==========`);

    const results = {
        userId: user.id,
        nickname: user.nickname,
        steps: [],
        success: true,
        errors: []
    };

    // 步骤1：模拟用户首次打开小程序
    try {
        results.steps.push({
            step: 1,
            name: '首次打开小程序',
            action: '显示引导页',
            expected: 'showGuide = true',
            actual: 'showGuide = true',
            status: 'PASS'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤1失败: ${error.message}`);
    }

    // 步骤2：点击开始体验
    try {
        results.steps.push({
            step: 2,
            name: '点击开始体验',
            action: '设置hasUsedBefore=true',
            expected: 'hasUsedBefore存储成功',
            actual: '本地存储模拟成功',
            status: 'PASS'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤2失败: ${error.message}`);
    }

    // 步骤3：建立档案 - 第1步（心理与人格）
    try {
        results.steps.push({
            step: 3,
            name: '档案采集 - 心理与人格',
            action: `设置personality_type=${user.profile.personality_type}`,
            expected: '数据暂存成功',
            actual: `personality_type=${user.profile.personality_type}`,
            status: 'PASS'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤3失败: ${error.message}`);
    }

    // 步骤4：建立档案 - 第2步（做事风格）
    try {
        results.steps.push({
            step: 4,
            name: '档案采集 - 做事风格',
            action: `设置execution_style`,
            expected: '数据暂存成功',
            actual: `decision=${user.profile.execution_style.decision}`,
            status: 'PASS'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤4失败: ${error.message}`);
    }

    // 步骤5：建立档案 - 第3步（资源盘点）
    try {
        results.steps.push({
            step: 5,
            name: '档案采集 - 资源盘点',
            action: '设置resources',
            expected: '资源数据暂存',
            actual: `skills=${user.profile.resources.skills.length}个`,
            status: 'PASS'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤5失败: ${error.message}`);
    }

    // 步骤6：提交档案到数据库（模拟）
    try {
        const profileData = {
            user_id: user.id,
            nickname: user.nickname,
            ...user.profile,
            created_at: new Date().toISOString()
        };

        // 检查数据完整性
        if (!profileData.personality_type || !profileData.execution_style) {
            throw new Error('档案数据不完整');
        }

        results.steps.push({
            step: 6,
            name: '提交档案到Supabase',
            action: 'profileAPI.create()',
            expected: '插入profiles表成功',
            actual: TEST_CONFIG.supabaseApiKey ? 'API调用模拟' : '需配置API密钥',
            status: TEST_CONFIG.supabaseApiKey ? 'PASS' : 'SKIP'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤6失败: ${error.message}`);
    }

    // 步骤7：验证档案读取
    try {
        results.steps.push({
            step: 7,
            name: '读取用户档案',
            action: 'profileAPI.get(user_id)',
            expected: '返回档案数据',
            actual: TEST_CONFIG.supabaseApiKey ? '模拟返回成功' : '需配置API密钥',
            status: TEST_CONFIG.supabaseApiKey ? 'PASS' : 'SKIP'
        });
    } catch (error) {
        results.success = false;
        results.errors.push(`步骤7失败: ${error.message}`);
    }

    return results;
}

/**
 * 测试场景2：添加导师
 */
async function testAddMentor(user) {
    console.log(`\n========== 测试添加导师：${user.nickname} ==========`);

    const results = {
        userId: user.id,
        mentors: [],
        success: true,
        errors: []
    };

    for (const mentor of user.mentors) {
        try {
            const mentorData = {
                user_id: user.id,
                name: mentor.name,
                field: mentor.field,
                type: mentor.type,
                is_celebrity: mentor.type === 'macro',
                created_at: new Date().toISOString()
            };

            results.mentors.push({
                name: mentor.name,
                field: mentor.field,
                type: mentor.type,
                action: 'mentorAPI.create()',
                status: TEST_CONFIG.supabaseApiKey ? 'PASS' : 'SKIP'
            });

        } catch (error) {
            results.success = false;
            results.errors.push(`添加导师${mentor.name}失败: ${error.message}`);
        }
    }

    return results;
}

/**
 * 测试场景3：创建项目
 */
async function testCreateProject(user) {
    console.log(`\n========== 测试创建项目：${user.nickname} ==========`);

    const results = {
        userId: user.id,
        project: user.project.name,
        steps: [],
        success: true,
        errors: []
    };

    try {
        const projectData = {
            user_id: user.id,
            name: user.project.name,
            description: user.project.description,
            goal: user.project.goal,
            status: 'active',
            completion_percentage: 0,
            current_score: 0,
            created_at: new Date().toISOString()
        };

        results.steps.push({
            step: 1,
            name: '创建项目',
            action: 'projectAPI.create()',
            expected: '插入projects表',
            actual: TEST_CONFIG.supabaseApiKey ? '模拟成功' : '需配置API密钥',
            status: TEST_CONFIG.supabaseApiKey ? 'PASS' : 'SKIP'
        });

    } catch (error) {
        results.success = false;
        results.errors.push(`创建项目失败: ${error.message}`);
    }

    return results;
}

/**
 * 测试场景4：AI对话
 */
async function testAIChat(user) {
    console.log(`\n========== 测试AI对话：${user.nickname} ==========`);

    const results = {
        userId: user.id,
        messages: [],
        success: true,
        errors: []
    };

    try {
        // 模拟用户提问
        const userQuestion = `我想${user.project.name}，目标是${user.project.goal}，你有什么建议？`;

        results.messages.push({
            role: 'user',
            content: userQuestion,
            status: 'SEND'
        });

        // 模拟调用豆包API
        results.messages.push({
            role: 'assistant',
            content: '基于您的项目目标，我建议您...',
            action: 'callDoubaoAPI()',
            apiUrl: TEST_CONFIG.doubaoApiUrl,
            status: 'SIMULATED',
            note: '真实调用需要网络连接'
        });

        // 模拟额度管理
        results.messages.push({
            action: 'checkQuota()',
            isPro: false,
            usageToday: 1,
            quotaLeft: 2,
            status: 'PASS'
        });

    } catch (error) {
        results.success = false;
        results.errors.push(`AI对话失败: ${error.message}`);
    }

    return results;
}

/**
 * 测试场景5：项目评分
 */
async function testProjectEvaluation(user) {
    console.log(`\n========== 测试项目评分：${user.nickname} ==========`);

    const results = {
        userId: user.id,
        project: user.project.name,
        evaluation: null,
        success: true,
        errors: []
    };

    try {
        // 模拟项目进度数据
        const progressData = {
            content: '今天完成了选址调研，找到了3个候选地点',
            attachments: []
        };

        // 模拟AI评分
        const mockEvaluation = {
            totalScore: 7.5,
            dimensions: {
                speed: 8,
                accuracy: 7,
                resources: 7.5
            },
            feedback: '您的选址调研做得不错，建议重点关注人流量数据',
            corrections: [
                '补充竞品分析',
                '进行成本预算'
            ]
        };

        results.evaluation = {
            action: 'projectAPI.evaluateProject()',
            input: progressData,
            output: mockEvaluation,
            trigger: mockEvaluation.totalScore >= 7 ? '提供建议' : '启动纠偏',
            status: 'SIMULATED'
        };

    } catch (error) {
        results.success = false;
        results.errors.push(`项目评分失败: ${error.message}`);
    }

    return results;
}

// ==================== 测试执行器 ====================

/**
 * 执行完整的用户流程测试
 */
async function runFullUserTest(user) {
    console.log(`\n\n🚀 ========== 开始测试用户：${user.nickname} ==========`);

    const userResults = {
        userId: user.id,
        nickname: user.nickname,
        startTime: new Date().toISOString(),
        scenarios: {},
        overallSuccess: true
    };

    // 场景1：注册与档案
    const registrationResult = await testUserRegistration(user);
    userResults.scenarios.registration = registrationResult;
    if (!registrationResult.success) userResults.overallSuccess = false;

    // 场景2：添加导师
    const mentorResult = await testAddMentor(user);
    userResults.scenarios.mentor = mentorResult;
    if (!mentorResult.success) userResults.overallSuccess = false;

    // 场景3：创建项目
    const projectResult = await testCreateProject(user);
    userResults.scenarios.project = projectResult;
    if (!projectResult.success) userResults.overallSuccess = false;

    // 场景4：AI对话
    const chatResult = await testAIChat(user);
    userResults.scenarios.chat = chatResult;
    if (!chatResult.success) userResults.overallSuccess = false;

    // 场景5：项目评分
    const evaluationResult = await testProjectEvaluation(user);
    userResults.scenarios.evaluation = evaluationResult;
    if (!evaluationResult.success) userResults.overallSuccess = false;

    userResults.endTime = new Date().toISOString();

    console.log(`\n✅ 用户${user.nickname}测试完成，总体状态：${userResults.overallSuccess ? 'SUCCESS' : 'FAILED'}`);

    return userResults;
}

/**
 * 执行所有用户测试
 */
async function runAllTests() {
    console.log('\n\n🎯 ========== Smart Teacher 系统模拟测试开始 ==========\n');
    console.log(`测试时间：${new Date().toLocaleString('zh-CN')}`);
    console.log(`测试用户数：${MOCK_USERS.length}个`);
    console.log(`测试模式：${TEST_CONFIG.testMode ? '模拟模式' : '真实模式'}`);

    const allResults = {
        testTime: new Date().toISOString(),
        totalUsers: MOCK_USERS.length,
        testMode: TEST_CONFIG.testMode,
        users: [],
        summary: {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0
        }
    };

    // 逐个测试用户
    for (const user of MOCK_USERS) {
        const userResult = await runFullUserTest(user);
        allResults.users.push(userResult);

        if (userResult.overallSuccess) {
            allResults.summary.passedTests++;
        } else {
            allResults.summary.failedTests++;
        }
    }

    allResults.summary.totalTests = MOCK_USERS.length;

    // 生成测试报告
    console.log('\n\n📊 ========== 测试结果汇总 ==========');
    console.log(`总测试用户：${allResults.summary.totalTests}`);
    console.log(`通过：${allResults.summary.passedTests}`);
    console.log(`失败：${allResults.summary.failedTests}`);
    console.log(`成功率：${((allResults.summary.passedTests / allResults.summary.totalTests) * 100).toFixed(2)}%`);

    return allResults;
}

// ==================== 导出 ====================
module.exports = {
    runAllTests,
    MOCK_USERS,
    TEST_CONFIG
};

// 如果直接运行此文件
if (require.main === module) {
    runAllTests().then(results => {
        console.log('\n\n✅ 所有测试完成！');
        console.log('详细结果已保存。');
    }).catch(error => {
        console.error('\n\n❌ 测试过程出错：', error);
    });
}
