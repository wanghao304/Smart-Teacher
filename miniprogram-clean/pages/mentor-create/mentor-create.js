// pages/mentor-create/mentor-create.js
const app = getApp();

Page({
    data: {
        mode: '',
        celebrities: [
            { id: 'musk', name: '埃隆·马斯克', field: 'AI/航天/创新', avatar: '🚀', desc: '特斯拉CEO，SpaceX创始人' },
            { id: 'jobs', name: '史蒂夫·乔布斯', field: '产品/设计', avatar: '🍎', desc: '苹果公司联合创始人' },
            { id: 'buffett', name: '沃伦·巴菲特', field: '投资/商业', avatar: '💰', desc: '伯克希尔哈撒韦CEO' },
            { id: 'dalio', name: '瑞·达利欧', field: '投资/管理', avatar: '📊', desc: '桥水基金创始人' },
            { id: 'inamori', name: '稻盛和夫', field: '企业经营/哲学', avatar: '🎎', desc: '京瓷创始人，经营之圣' },
            { id: 'bezos', name: '杰夫·贝索斯', field: '电商/云计算', avatar: '📦', desc: '亚马逊创始人' },
            { id: 'gates', name: '比尔·盖茨', field: '软件/慈善', avatar: '💻', desc: '微软联合创始人' },
            { id: 'thiel', name: '彼得·蒂尔', field: '创业/投资', avatar: '🦄', desc: 'PayPal联合创始人' },
            { id: 'munger', name: '查理·芒格', field: '投资/思维模型', avatar: '📚', desc: '伯克希尔副主席' },
            { id: 'drucker', name: '彼得·德鲁克', field: '管理学', avatar: '📖', desc: '现代管理学之父' }
        ],
        selectedCelebrity: null,
        customMentor: {
            name: '',
            field: '',
            background: '',
            achievements: '',
            methodology: ''
        },
        aiLoading: false,
        aiMentors: [],
        step: 0
    },

    selectMode(e) {
        const mode = e.currentTarget.dataset.mode;
        this.setData({
            mode,
            step: mode === 'ai' ? 2 : 1
        });

        if (mode === 'ai') {
            this.startAIRecommend();
        }
    },

    selectCelebrity(e) {
        const id = e.currentTarget.dataset.id;
        const celebrity = this.data.celebrities.find(c => c.id === id);
        this.setData({ selectedCelebrity: celebrity });
    },

    confirmCelebrity() {
        if (!this.data.selectedCelebrity) {
            return wx.showToast({ title: '请选择名人', icon: 'none' });
        }

        wx.showLoading({ title: 'AI分析中...', mask: true });

        const celebrity = this.data.selectedCelebrity;

        setTimeout(() => {
            const mentor = {
                id: `celeb_${celebrity.id}_${Date.now()}`,
                name: celebrity.name,
                type: 'celebrity',
                field: celebrity.field,
                avatar: celebrity.avatar,
                background: `${celebrity.desc}，在${celebrity.field}领域有深厚造诣`,
                methodology: this.generateMethodology(celebrity),
                prompt: this.generatePrompt(celebrity),
                createdAt: new Date().toISOString()
            };

            this.saveMentor(mentor);
        }, 2000);
    },

    onCustomInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({
            [`customMentor.${field}`]: e.detail.value
        });
    },

    confirmCustom() {
        const { name, field, background } = this.data.customMentor;

        if (!name || !field || !background) {
            return wx.showToast({ title: '请填写完整', icon: 'none' });
        }

        wx.showLoading({ title: 'AI提炼中...', mask: true });

        setTimeout(() => {
            const mentor = {
                id: `custom_${Date.now()}`,
                name,
                type: 'custom',
                field,
                avatar: name.substring(0, 1),
                background,
                achievements: this.data.customMentor.achievements,
                methodology: this.generateCustomMethodology(this.data.customMentor),
                prompt: this.generateCustomPrompt(this.data.customMentor),
                createdAt: new Date().toISOString()
            };

            this.saveMentor(mentor);
        }, 2000);
    },

    startAIRecommend() {
        const profile = wx.getStorageSync('userProfile');

        if (!profile) {
            wx.showModal({
                title: '提示',
                content: '请先完善个人档案',
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({ url: '/pages/profile/profile' });
                    } else {
                        wx.navigateBack();
                    }
                }
            });
            return;
        }

        this.setData({ aiLoading: true });

        setTimeout(() => {
            const mentors = this.getMockAIMentors(profile);
            this.setData({
                aiMentors: mentors,
                aiLoading: false
            });
        }, 2000);
    },

    selectAIMentor(e) {
        const index = e.currentTarget.dataset.index;
        const mentor = this.data.aiMentors[index];

        wx.showLoading({ title: '创建中...', mask: true });

        setTimeout(() => {
            const fullMentor = {
                ...mentor,
                id: `ai_${Date.now()}`,
                type: 'ai_recommended',
                createdAt: new Date().toISOString()
            };

            this.saveMentor(fullMentor);
        }, 1000);
    },

    saveMentor(mentor) {
        const mentors = wx.getStorageSync('userMentors') || [];
        mentors.push(mentor);
        wx.setStorageSync('userMentors', mentors);

        wx.hideLoading();
        wx.showToast({
            title: '导师创建成功',
            icon: 'success',
            duration: 2000
        });

        setTimeout(() => {
            wx.switchTab({ url: '/pages/mentors/index' });
        }, 2000);
    },

    generateMethodology(celebrity) {
        const methodologies = {
            'musk': '第一性原理思维：回归事物本质，从基本公理出发重新构建问题。快速迭代：MVP思维，快速试错。超长期愿景：10年以上的战略规划。',
            'jobs': '极致产品主义：追求完美的用户体验。减法哲学：去除一切不必要的元素。现实扭曲力场：用愿景激励团队。',
            'buffett': '价值投资：寻找被低估的优质企业。能力圈原则：只投资自己理解的领域。长期主义：持有优质资产数十年。',
            'dalio': '原则思维：建立决策原则体系。极度透明：鼓励坦诚沟通。进化思维：不断迭代改进。',
            'inamori': '敬天爱人：以利他之心经营企业。阿米巴经营：小团队独立核算。六项精进：持续自我修炼。'
        };
        return methodologies[celebrity.id] || '待AI分析...';
    },

    generatePrompt(celebrity) {
        return `你是${celebrity.name}，${celebrity.desc}。你擅长${celebrity.field}。请以${celebrity.name}的视角和思维方式，为用户提供指导和建议。`;
    },

    generateCustomMethodology(mentor) {
        return `基于${mentor.name}在${mentor.field}的经验，核心方法论包括：${mentor.background}。代表成就：${mentor.achievements}。`;
    },

    generateCustomPrompt(mentor) {
        return `你是${mentor.name}，擅长${mentor.field}。背景：${mentor.background}。请以${mentor.name}的经验和视角为用户提供指导。`;
    },

    getMockAIMentors(profile) {
        return [
            {
                name: '李笑来',
                field: '写作/投资',
                avatar: '✍️',
                background: '著名作家、投资人，擅长知识变现',
                reason: `基于您${profile.learningType === 'cross_field' ? '想学习' + profile.targetField : '在' + profile.currentRole + '遇到的困扰'}，推荐此导师`,
                methodology: '认知升级、写作变现、长期投资',
                prompt: '你是李笑来，请提供实用的成长建议'
            },
            {
                name: '张一鸣',
                field: '产品/技术',
                avatar: '🎯',
                background: '字节跳动创始人，算法驱动产品专家',
                reason: '您的技能特点与产品创新相关',
                methodology: 'always day 1、延迟满足、全局思维',
                prompt: '你是张一鸣，请提供产品和管理建议'
            }
        ];
    },

    goBack() {
        if (this.data.step > 0) {
            this.setData({ step: 0, mode: '' });
        } else {
            wx.navigateBack();
        }
    }
});
