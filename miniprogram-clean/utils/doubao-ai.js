// utils/doubao-ai.js
const API_KEY = '361fc5ee-74d8-45cf-bc70-3685385fddf3';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const MODEL = 'doubao-seed-1-6-251015';

const generateMentors = (profile) => {
    return new Promise((resolve, reject) => {
        // 构建 Prompt
        const systemPrompt = `你是一个专家级导师匹配系统。请基于用户画像，推荐3位最适合的导师（可以是历史名人、商业领袖、领域专家或虚拟角色）。
    
    用户画像：
    - 行业：${profile.industry}
    - 职位：${profile.jobTitle}
    - 现状：${profile.currentStatus} (稳定/瓶颈/转型/学习)
    - 做事风格：${profile.workStyle} (独立/团队)
    - 决策习惯：${profile.decisionStyle} (直觉/逻辑)
    - 核心目标：${profile.primaryGoal}
    - 期望导师风格：${profile.mentorStyle}

    要求：
    1. 推荐3位导师：
       - 第1位：领域专家（解决专业问题）
       - 第2位：互补型导师（弥补用户短板，如用户是直觉型则推荐逻辑型导师）
       - 第3位：风格匹配导师（符合用户期望的指导风格）
    2. 返回纯 JSON 数组格式，不要包含 Markdown 标记或其他文字。
    3. JSON 结构示例：
    [
      {
        "name": "导师名字",
        "title": "头衔",
        "desc": "简短介绍",
        "tags": ["标签1", "标签2"],
        "reason": "推荐理由"
      }
    ]`;

        wx.request({
            url: API_URL,
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            data: {
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: '请开始推荐。' }
                ],
                temperature: 0.7
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
                    const content = res.data.choices[0].message.content;
                    try {
                        // 尝试解析 JSON
                        // 有时候 AI 会返回 ```json ... ```，需要清洗
                        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
                        const mentors = JSON.parse(cleanContent);
                        resolve(mentors);
                    } catch (e) {
                        console.error('JSON解析失败', e, content);
                        // 如果解析失败，返回兜底数据或错误
                        reject(new Error('AI返回格式错误'));
                    }
                } else {
                    console.error('API请求失败', res);
                    reject(new Error('API请求失败'));
                }
            },
            fail: (err) => {
                console.error('网络错误', err);
                reject(err);
            }
        });
    });
};

module.exports = {
    generateMentors
};
