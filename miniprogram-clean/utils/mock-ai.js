// utils/mock-ai.js
// 这是一个模拟AI推荐引擎，用于演示根据用户画像动态生成导师的逻辑。
// 在生产环境中，这里应该替换为真实的 Doubao API 调用。

const MENTOR_DATABASE = {
    // 领域专家
    'tech': [
        { name: '图灵', title: '计算机科学之父', desc: '逻辑严密，直击本质', tags: ['技术', '逻辑'] },
        { name: '李开复', title: 'AI 专家', desc: '视野宏大，温文尔雅', tags: ['AI', '趋势'] }
    ],
    'business': [
        { name: '稻盛和夫', title: '经营之圣', desc: '敬天爱人，阿米巴经营', tags: ['管理', '心法'] },
        { name: '杰克·韦尔奇', title: 'CEO教父', desc: '结果导向，六西格玛', tags: ['管理', '效率'] }
    ],
    'art': [
        { name: '达芬奇', title: '全能天才', desc: '艺术与科学的完美结合', tags: ['设计', '创意'] },
        { name: '原研哉', title: '设计大师', desc: '极简主义，白', tags: ['设计', '美学'] }
    ],
    'life': [
        { name: '苏格拉底', title: '哲学导师', desc: '通过提问引导思考', tags: ['思维', '哲学'] },
        { name: '卡耐基', title: '人际关系大师', desc: '沟通与人性的洞察者', tags: ['沟通', '情商'] }
    ]
};

const generateMentors = (profile) => {
    const recommendations = [];
    const { industry, jobTitle, primaryGoal, mentorStyle, decisionStyle } = profile;

    // 1. 核心导师 (基于行业/目标)
    // 简单的关键词匹配逻辑
    let domain = 'business'; // 默认
    if (industry.includes('互联网') || industry.includes('科技') || primaryGoal === 'skill') domain = 'tech';
    if (industry.includes('设计') || industry.includes('艺术') || jobTitle.includes('设计')) domain = 'art';

    // 从对应领域随机选一个
    const domainMentors = MENTOR_DATABASE[domain];
    const coreMentor = domainMentors[Math.floor(Math.random() * domainMentors.length)];
    recommendations.push({
        ...coreMentor,
        reason: `基于您在【${industry}】行业的背景，为您匹配顶级领域专家。`
    });

    // 2. 互补导师 (基于短板/决策风格)
    // 如果用户是直觉型，配一个逻辑型导师；如果是逻辑型，配一个创意型。
    let complementMentor;
    if (decisionStyle === 'intuition') {
        complementMentor = MENTOR_DATABASE['tech'][0]; // 图灵 (逻辑)
        recommendations.push({
            ...complementMentor,
            reason: '针对您的【直觉型】决策风格，引入强逻辑导师进行互补。'
        });
    } else {
        complementMentor = MENTOR_DATABASE['art'][0]; // 达芬奇 (创意)
        recommendations.push({
            ...complementMentor,
            reason: '针对您的【数据型】决策风格，引入创新思维导师打破常规。'
        });
    }

    // 3. 风格导师 (基于期望风格)
    // 如果用户喜欢严厉，配韦尔奇；喜欢循循善诱，配李开复/苏格拉底
    let styleMentor;
    if (mentorStyle === 'strict' || mentorStyle === 'result') {
        styleMentor = MENTOR_DATABASE['business'][1]; // 韦尔奇
        recommendations.push({
            ...styleMentor,
            reason: '匹配您【结果导向】的期望，提供高压、高效的指导。'
        });
    } else {
        styleMentor = MENTOR_DATABASE['life'][1]; // 卡耐基
        recommendations.push({
            ...styleMentor,
            reason: '匹配您【循循善诱】的期望，提供鼓励与心理支持。'
        });
    }

    return recommendations;
};

module.exports = {
    generateMentors
};
