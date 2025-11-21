// utils/api.js
// API请求封装

const app = getApp();

/**
 * 豆包AI对话接口
 * @param {Array} messages - 对话消息数组
 * @param {Object} options - 可选配置
 * @returns {Promise} - 返回AI响应
 */
function callDoubaoAPI(messages, options = {}) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.doubaoApiUrl,
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${app.globalData.doubaoApiKey}`
            },
            data: {
                model: options.model || 'doubao-seed-1-6-251015',
                max_completion_tokens: options.maxTokens || 2000,
                messages: messages,
                reasoning_effort: options.reasoningEffort || 'medium',
                temperature: options.temperature || 0.7
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(new Error(`API请求失败: ${res.statusCode}`));
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

/**
 * Supabase数据库操作
 * @param {String} table - 表名
 * @param {String} operation - 操作类型 (select/insert/update/delete)
 * @param {Object} data - 数据
 * @returns {Promise}
 */
function supabaseRequest(table, operation, data = {}) {
    return new Promise((resolve, reject) => {
        const baseUrl = app.globalData.apiBaseUrl;
        const apiKey = app.globalData.apiKey;

        let url = `${baseUrl}/rest/v1/${table}`;
        let method = 'GET';
        let requestData = null;

        switch (operation) {
            case 'select':
                method = 'GET';
                if (data.filters) {
                    url += `?${new URLSearchParams(data.filters).toString()}`;
                }
                break;
            case 'insert':
                method = 'POST';
                requestData = data;
                break;
            case 'update':
                method = 'PATCH';
                requestData = data.values;
                if (data.filters) {
                    url += `?${new URLSearchParams(data.filters).toString()}`;
                }
                break;
            case 'delete':
                method = 'DELETE';
                if (data.filters) {
                    url += `?${new URLSearchParams(data.filters).toString()}`;
                }
                break;
            default:
                reject(new Error('不支持的操作类型'));
                return;
        }

        wx.request({
            url: url,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`
            },
            data: requestData,
            success: (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else {
                    reject(new Error(`数据库操作失败: ${res.statusCode}`));
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

/**
 * 用户档案相关API
 */
const profileAPI = {
    // 创建用户档案
    create: (profileData) => {
        return supabaseRequest('profiles', 'insert', profileData);
    },

    // 获取用户档案
    get: (userId) => {
        return supabaseRequest('profiles', 'select', {
            filters: { user_id: `eq.${userId}` }
        });
    },

    // 更新用户档案
    update: (userId, updates) => {
        return supabaseRequest('profiles', 'update', {
            values: updates,
            filters: { user_id: `eq.${userId}` }
        });
    }
};

/**
 * 导师相关API
 */
const mentorAPI = {
    // 创建导师
    create: (mentorData) => {
        return supabaseRequest('mentors', 'insert', mentorData);
    },

    // 获取用户的导师列表
    getByUser: (userId) => {
        return supabaseRequest('mentors', 'select', {
            filters: { user_id: `eq.${userId}` }
        });
    },

    // 智能推荐导师
    recommend: async (userProfile, projectGoal) => {
        // 调用AI生成推荐
        const prompt = `根据用户画像和项目目标，推荐合适的导师。
用户画像：${JSON.stringify(userProfile)}
项目目标：${projectGoal}

请推荐3-5位导师，包括：
1. 宏观导师（行业领袖）
2. 实战导师（本土化专家）

返回JSON格式：{"mentors": [{"name": "", "field": "", "reason": ""}]}`;

        const messages = [
            { role: 'user', content: prompt }
        ];

        try {
            const response = await callDoubaoAPI(messages);
            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('导师推荐失败:', error);
            throw error;
        }
    }
};

/**
 * 项目相关API
 */
const projectAPI = {
    // 创建项目
    create: (projectData) => {
        return supabaseRequest('projects', 'insert', projectData);
    },

    // 获取用户的项目列表
    getByUser: (userId) => {
        return supabaseRequest('projects', 'select', {
            filters: { user_id: `eq.${userId}` }
        });
    },

    // 更新项目进度
    updateProgress: (projectId, progressData) => {
        return supabaseRequest('projects', 'update', {
            values: progressData,
            filters: { id: `eq.${projectId}` }
        });
    },

    // AI评分项目
    evaluateProject: async (projectData, mentorModels) => {
        const prompt = `作为专业导师团队，评估用户的项目执行情况。

项目信息：${JSON.stringify(projectData)}
导师模型：${JSON.stringify(mentorModels)}

请从以下维度评分（0-10分）：
1. 执行速度
2. 方向准确度
3. 资源利用率

返回JSON格式：{
  "totalScore": 7.5,
  "dimensions": {
    "speed": 8,
    "accuracy": 7,
    "resources": 7.5
  },
  "feedback": "具体建议...",
  "corrections": ["纠偏建议1", "纠偏建议2"]
}`;

        const messages = [
            { role: 'user', content: prompt }
        ];

        try {
            const response = await callDoubaoAPI(messages);
            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('项目评分失败:', error);
            throw error;
        }
    }
};

/**
 * 任务/日历相关API
 */
const taskAPI = {
    // 创建任务
    create: (taskData) => {
        return supabaseRequest('tasks', 'insert', taskData);
    },

    // 获取用户的任务列表
    getByUser: (userId, filters = {}) => {
        return supabaseRequest('tasks', 'select', {
            filters: { user_id: `eq.${userId}`, ...filters }
        });
    },

    // 更新任务状态
    updateStatus: (taskId, status) => {
        return supabaseRequest('tasks', 'update', {
            values: { status },
            filters: { id: `eq.${taskId}` }
        });
    },

    // 设置提醒
    setReminder: (taskId, reminderTime) => {
        // 调用微信小程序订阅消息
        return new Promise((resolve, reject) => {
            wx.requestSubscribeMessage({
                tmplIds: ['YOUR_TEMPLATE_ID'], // 需要在微信公众平台配置
                success: (res) => {
                    console.log('订阅成功', res);
                    resolve(res);
                },
                fail: (err) => {
                    console.error('订阅失败', err);
                    reject(err);
                }
            });
        });
    }
};

/**
 * 分享相关API
 */
const shareAPI = {
    // 生成分享链接
    generateLink: (projectId, role = 'observer') => {
        const shareCode = `ST${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // 存储分享记录
        return supabaseRequest('share_links', 'insert', {
            project_id: projectId,
            share_code: shareCode,
            role: role,
            created_at: new Date().toISOString()
        }).then(() => {
            return {
                shareCode: shareCode,
                url: `pages/share/share?code=${shareCode}`
            };
        });
    },

    // 记录邀请奖励
    recordInvite: (inviterId, invitedUserId) => {
        return supabaseRequest('invites', 'insert', {
            inviter_id: inviterId,
            invited_user_id: invitedUserId,
            reward_status: 'pending',
            created_at: new Date().toISOString()
        });
    },

    // 生成成果海报
    generatePoster: async (projectData) => {
        // 使用Canvas API生成海报
        return new Promise((resolve, reject) => {
            const query = wx.createSelectorQuery();
            query.select('#posterCanvas')
                .fields({ node: true, size: true })
                .exec((res) => {
                    if (res[0]) {
                        const canvas = res[0].node;
                        const ctx = canvas.getContext('2d');

                        // 绘制海报内容
                        canvas.width = 750;
                        canvas.height = 1334;

                        // 背景
                        ctx.fillStyle = '#667eea';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        // 项目名称
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '48px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(projectData.name, canvas.width / 2, 200);

                        // 完成度
                        ctx.font = '36px sans-serif';
                        ctx.fillText(`完成度: ${projectData.completion}%`, canvas.width / 2, 300);

                        // 导师评分
                        ctx.fillText(`导师评分: ${projectData.score}/10`, canvas.width / 2, 400);

                        // 转换为图片
                        wx.canvasToTempFilePath({
                            canvas: canvas,
                            success: (res) => {
                                resolve(res.tempFilePath);
                            },
                            fail: reject
                        });
                    } else {
                        reject(new Error('Canvas未找到'));
                    }
                });
        });
    }
};

/**
 * AI对话助手
 */
const chatAPI = {
    // 发送消息
    send: async (messages, context = {}) => {
        try {
            // 检查使用额度
            if (!app.checkQuota()) {
                throw new Error('今日使用额度已用完');
            }

            // 调用豆包API
            const response = await callDoubaoAPI(messages, {
                temperature: context.temperature || 0.7,
                maxTokens: context.maxTokens || 2000
            });

            // 增加使用次数
            app.increaseUsage();

            return response;
        } catch (error) {
            console.error('对话失败:', error);
            throw error;
        }
    },

    // 导师圆桌会议
    mentorRoundtable: async (question, mentors) => {
        const mentorPrompts = mentors.map(m =>
            `${m.name}（${m.field}）的观点：${m.philosophy}`
        ).join('\n');

        const prompt = `现在有一个问题需要导师团队讨论：
${question}

导师团队成员：
${mentorPrompts}

请模拟导师团队的讨论过程，给出不同观点和最终综合建议。`;

        const messages = [
            { role: 'system', content: '你是一个AI导师协调员，负责组织导师圆桌会议。' },
            { role: 'user', content: prompt }
        ];

        return callDoubaoAPI(messages, {
            maxTokens: 3000,
            temperature: 0.8
        });
    }
};

module.exports = {
    callDoubaoAPI,
    supabaseRequest,
    profileAPI,
    mentorAPI,
    projectAPI,
    taskAPI,
    shareAPI,
    chatAPI
};
