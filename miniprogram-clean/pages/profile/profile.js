// pages/profile/profile.js
const app = getApp();

Page({
    data: {
        step: 1,
        totalSteps: 7,
        isFirstLogin: true, // 是否首次登录

        // Step 1
        currentIndustry: '',
        currentRole: '',
        yearsExp: 3,

        // Step 2
        learningType: '',
        targetField: '',
        targetProject: '',
        currentChallenge: '',
        learningMotivation: [], // 改为数组支持多选
        motivationOptions: [
            { id: 'career', label: '职业转型' },
            { id: 'side', label: '副业创收' },
            { id: 'interest', label: '纯粹兴趣' },
            { id: 'solve', label: '解决具体问题' }
        ],
        targetTimeline: 6,

        // Step 3 - 扩充选项
        techSkills: [],
        techOptions: [
            '编程开发', '数据分析', '设计创意', '文案写作',
            '视频剪辑', '运营推广', '项目管理', '财务分析',
            '产品设计', 'UI/UX设计', '前端开发', '后端开发',
            '数据库管理', '测试QA', '运维DevOps', 'SEO/SEM',
            '市场营销', '商务拓展', '供应链管理', '法务合规'
        ],
        softSkills: [],
        softOptions: [
            '沟通表达', '团队协作', '批判性思维', '问题解决',
            '时间管理', '情绪管理', '谈判说服', '快速学习',
            '领导力', '创新思维', '战略规划', '执行力',
            '抗压能力', '同理心', '跨文化沟通', '冲突解决'
        ],
        strengthArea: '',
        weakArea: '',

        // Step 4
        learningSpeed: 5,
        comprehensionStyle: '',
        comprehensionOptions: [
            { id: 'visual', label: '视觉型', desc: '看图表、视频' },
            { id: 'auditory', label: '听觉型', desc: '听讲解、播客' },
            { id: 'kinesthetic', label: '实践型', desc: '动手做' }
        ],
        preferredMethod: '',
        methodOptions: [
            { id: 'structured', label: '系统课程' },
            { id: 'project', label: '项目驱动' },
            { id: 'mentor', label: '一对一指导' },
            { id: 'community', label: '社群共学' }
        ],

        // Step 5
        communicationStyle: '',
        commOptions: [
            { id: 'direct', label: '直接型', desc: '开门见山' },
            { id: 'gentle', label: '温和型', desc: '委婉表达' }
        ],
        stressResistance: 5,
        energySource: '',
        energyOptions: [
            { id: 'solo', label: '独处充电' },
            { id: 'social', label: '社交充电' }
        ],

        // Step 6
        mentorStyle: '',
        styleOptions: [
            { id: 'strict', label: '严格督促', desc: '推着我走' },
            { id: 'supportive', label: '温和陪伴', desc: '听我倾诉' },
            { id: 'strategic', label: '战略指导', desc: '点拨方向' }
        ],
        mentorBackground: '',

        // Step 7 - 修改为自我介绍
        selfIntroduction: ''
    },

    onLoad(options) {
        // 检查是否首次登录
        const hasProfile = wx.getStorageSync('userProfile');
        this.setData({ isFirstLogin: !hasProfile });
    },

    // Step 1
    bindExpChange(e) {
        this.setData({ yearsExp: e.detail.value });
    },

    // Step 2
    selectLearningType(e) {
        this.setData({ learningType: e.currentTarget.dataset.type });
    },

    // 修改为多选toggle逻辑
    selectMotivation(e) {
        const id = e.currentTarget.dataset.id;
        let motivations = this.data.learningMotivation;
        const index = motivations.indexOf(id);

        if (index > -1) {
            motivations.splice(index, 1);
        } else {
            motivations.push(id);
        }

        this.setData({ learningMotivation: motivations });
    },

    bindTimelineChange(e) {
        this.setData({ targetTimeline: e.detail.value });
    },

    // Step 3 - 增加到5个
    toggleTechSkill(e) {
        const skill = e.currentTarget.dataset.skill;
        let skills = this.data.techSkills;
        const index = skills.indexOf(skill);

        if (index > -1) {
            skills.splice(index, 1);
        } else {
            if (skills.length >= 5) {
                wx.showToast({ title: '最多选5个', icon: 'none' });
                return;
            }
            skills.push(skill);
        }
        this.setData({ techSkills: skills });
    },

    toggleSoftSkill(e) {
        const skill = e.currentTarget.dataset.skill;
        let skills = this.data.softSkills;
        const index = skills.indexOf(skill);

        if (index > -1) {
            skills.splice(index, 1);
        } else {
            if (skills.length >= 5) {
                wx.showToast({ title: '最多选5个', icon: 'none' });
                return;
            }
            skills.push(skill);
        }
        this.setData({ softSkills: skills });
    },

    // Step 4
    bindSpeedChange(e) {
        this.setData({ learningSpeed: e.detail.value });
    },
    selectComprehension(e) {
        this.setData({ comprehensionStyle: e.currentTarget.dataset.id });
    },
    selectMethod(e) {
        this.setData({ preferredMethod: e.currentTarget.dataset.id });
    },

    // Step 5
    selectComm(e) {
        this.setData({ communicationStyle: e.currentTarget.dataset.id });
    },
    bindStressChange(e) {
        this.setData({ stressResistance: e.detail.value });
    },
    selectEnergy(e) {
        this.setData({ energySource: e.currentTarget.dataset.id });
    },

    // Step 6
    selectMentorStyle(e) {
        this.setData({ mentorStyle: e.currentTarget.dataset.id });
    },

    // Navigation
    nextStep() {
        if (this.data.step === 1) {
            if (!this.data.currentIndustry || !this.data.currentRole) {
                return wx.showToast({ title: '请填写完整', icon: 'none' });
            }
        }
        if (this.data.step === 2) {
            if (!this.data.learningType) {
                return wx.showToast({ title: '请选择学习类型', icon: 'none' });
            }
            if (this.data.learningType === 'cross_field') {
                if (!this.data.targetField || !this.data.targetProject) {
                    return wx.showToast({ title: '请填写学习目标', icon: 'none' });
                }
            } else {
                if (!this.data.currentChallenge) {
                    return wx.showToast({ title: '请描述当前困扰', icon: 'none' });
                }
            }
        }
        if (this.data.step === 3) {
            if (this.data.techSkills.length === 0 || !this.data.strengthArea || !this.data.weakArea) {
                return wx.showToast({ title: '请完成所有问题', icon: 'none' });
            }
        }
        if (this.data.step === 4) {
            if (!this.data.comprehensionStyle || !this.data.preferredMethod) {
                return wx.showToast({ title: '请完成所有问题', icon: 'none' });
            }
        }
        if (this.data.step === 5) {
            if (!this.data.communicationStyle || !this.data.energySource) {
                return wx.showToast({ title: '请完成所有问题', icon: 'none' });
            }
        }
        if (this.data.step === 6) {
            if (!this.data.mentorStyle) {
                return wx.showToast({ title: '请选择导师风格', icon: 'none' });
            }
        }

        if (this.data.step === 7) {
            if (!this.data.selfIntroduction) {
                return wx.showToast({ title: '请填写自我介绍', icon: 'none' });
            }
            this.submitProfile();
        } else {
            this.setData({ step: this.data.step + 1 });
        }
    },

    prevStep() {
        this.setData({ step: this.data.step - 1 });
    },

    submitProfile() {
        const profile = {
            currentIndustry: this.data.currentIndustry,
            currentRole: this.data.currentRole,
            yearsExp: this.data.yearsExp,
            learningType: this.data.learningType,
            targetField: this.data.targetField,
            targetProject: this.data.targetProject,
            currentChallenge: this.data.currentChallenge,
            learningMotivation: this.data.learningMotivation, // 数组
            targetTimeline: this.data.targetTimeline,
            techSkills: this.data.techSkills,
            softSkills: this.data.softSkills,
            strengthArea: this.data.strengthArea,
            weakArea: this.data.weakArea,
            learningSpeed: this.data.learningSpeed,
            comprehensionStyle: this.data.comprehensionStyle,
            preferredMethod: this.data.preferredMethod,
            communicationStyle: this.data.communicationStyle,
            stressResistance: this.data.stressResistance,
            energySource: this.data.energySource,
            mentorStyle: this.data.mentorStyle,
            mentorBackground: this.data.mentorBackground,
            selfIntroduction: this.data.selfIntroduction, // 修改字段名
            createdAt: new Date().toISOString()
        };

        wx.setStorageSync('userProfile', profile);

        wx.showToast({
            title: '档案建立成功',
            icon: 'success',
            duration: 2000
        });

        // 如果是首次登录，跳转到录入导师页面
        setTimeout(() => {
            if (this.data.isFirstLogin) {
                wx.navigateTo({ url: '/pages/mentor-create/mentor-create' });
            } else {
                wx.switchTab({ url: '/pages/index/index' });
            }
        }, 2000);
    }
});
