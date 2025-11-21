// pages/match/match.js - 导师匹配页面
const app = getApp();

Page({
    data: {
        loading: true,
        matchProgress: 0,
        userProfile: null,
        matchedMentors: [],

        goalSummary: {
            goal: '',
            industry: '',
            skillLevel: ''
        }
    },

    onLoad: function () {
        this.loadUserProfile();
        this.startMatching();
    },

    // 加载用户档案
    loadUserProfile: function () {
        const profile = wx.getStorageSync('userProfile');
        if (!profile) {
            wx.showToast({
                title: '请先建立档案',
                icon: 'none'
            });
            setTimeout(() => {
                wx.navigateTo({ url: '/pages/profile/profile' });
            }, 1500);
            return;
        }

        this.setData({
            userProfile: profile,
            'goalSummary.goal': profile.goalInfo.projectGoal,
            'goalSummary.industry': profile.goalInfo.targetIndustry,
            'goalSummary.skillLevel': profile.currentInfo.skillLevel
        });
    },

    // 开始匹配（模拟匹配过程）
    startMatching: function () {
        let progress = 0;
        const timer = setInterval(() => {
            progress += 10;
            this.setData({ matchProgress: progress });

            if (progress >= 100) {
                clearInterval(timer);
                setTimeout(() => {
                    this.performMatching();
                }, 500);
            }
        }, 100);
    },

    // 执行匹配算法
    performMatching: function () {
        const profile = this.data.userProfile;

        // 模拟导师数据（实际应从数据库获取）
        const allMentors = this.getMockMentors();

        // 计算匹配分数
        const scoredMentors = allMentors.map(mentor => {
            const score = this.calculateMatchScore(mentor, profile);
            return { ...mentor, matchScore: score };
        });

        // 按分数排序
        scoredMentors.sort((a, b) => b.matchScore - a.matchScore);

        // 取前5名
        const topMentors = scoredMentors.slice(0, 5);

        this.setData({
            loading: false,
            matchedMentors: topMentors
        });
    },

    // 计算匹配分数
    calculateMatchScore: function (mentor, profile) {
        let score = 0;

        // 1. 行业匹配 (50%)
        if (mentor.industry === profile.goalInfo.targetIndustry) {
            score += 50;
        } else if (this.isSimilarIndustry(mentor.industry, profile.goalInfo.targetIndustry)) {
            score += 30;
        }

        // 2. 技能水平匹配 (20%)
        const skillMatch = this.getSkillLevelMatch(mentor.teachingLevel, profile.currentInfo.skillLevel);
        score += skillMatch * 20;

        // 3. 风格匹配 (15%)
        if (mentor.teachingStyle === profile.learningPreference.mentorType) {
            score += 15;
        } else {
            score += 8;
        }

        // 4. 评价加分 (10%)
        score += (mentor.rating / 5) * 10;

        // 5. 经验加分 (5%)
        score += Math.min(mentor.experience / 2, 5);

        return Math.round(score);
    },

    // 判断行业相似性
    isSimilarIndustry: function (industry1, industry2) {
        const similarGroups = [
            ['互联网/科技', '教育/培训'],
            ['餐饮/食品', '零售/电商'],
            ['健康/健身', '医疗保健']
        ];

        return similarGroups.some(group =>
            group.includes(industry1) && group.includes(industry2)
        );
    },

    // 获取技能水平匹配度
    getSkillLevelMatch: function (teachingLevel, studentLevel) {
        const levels = {
            '完全新手': 0,
            '初学者': 1,
            '有基础': 2,
            '有经验': 3,
            '比较熟练': 4
        };

        const teachLv = levels[teachingLevel] || 0;
        const studentLv = levels[studentLevel.split('-')[0]] || 0;

        // 导师擅长的级别与学员当前级别越接近，匹配度越高
        const diff = Math.abs(teachLv - studentLv);
        return Math.max(1 - diff * 0.2, 0.5);
    },

    // 获取模拟导师数据
    getMockMentors: function () {
        return [
            {
                id: 1,
                name: '张三',
                avatar: '👨‍🍳',
                title: '餐饮连锁创始人',
                industry: '餐饮/食品',
                experience: 5,
                achievements: '从0到10家连锁店',
                specialties: ['选址分析', '品牌定位', '供应链管理', '团队建设'],
                teachingStyle: '👨‍💼 教练型-引导我思考',
                teachingLevel: '完全新手',
                rating: 4.9,
                reviewCount: 128,
                successCases: 15,
                price: 3000,
                communicationStyle: '每周1-2次视频沟通',
                intro: '5年餐饮创业经验，成功打造区域知名羊肉粉品牌'
            },
            {
                id: 2,
                name: '李四',
                avatar: '👨‍💻',
                title: 'AI工程师',
                industry: '互联网/科技',
                experience: 8,
                achievements: '带出50+编程学员',
                specialties: ['Python', '机器学习', '项目实战'],
                teachingStyle: '👨‍🏫 严师型-严格要求我',
                teachingLevel: '完全新手',
                rating: 4.8,
                reviewCount: 95,
                successCases: 23,
                price: 4000,
                communicationStyle: '每周3次在线答疑',
                intro: '8年AI开发经验，擅长零基础教学'
            },
            {
                id: 3,
                name: '王五',
                avatar: '👩‍🏫',
                title: '在线教育专家',
                industry: '教育/培训',
                experience: 10,
                achievements: '累计培训1000+学员',
                specialties: ['课程设计', '运营推广', '用户增长'],
                teachingStyle: '🤝 伙伴型-一起探讨',
                teachingLevel: '有基础',
                rating: 4.7,
                reviewCount: 156,
                successCases: 31,
                price: 3500,
                communicationStyle: '每周1次深度复盘',
                intro: '10年教育行业经验，帮助多个项目成功'
            },
            {
                id: 4,
                name: '赵六',
                avatar: '👨‍🍳',
                title: '餐饮品牌顾问',
                industry: '餐饮/食品',
                experience: 7,
                achievements: '服务100+餐饮品牌',
                specialties: ['品牌策划', '营销推广', '连锁扩张'],
                teachingStyle: '🧭 顾问型-给建议让我选',
                teachingLevel: '有经验',
                rating: 4.6,
                reviewCount: 89,
                successCases: 18,
                price: 5000,
                communicationStyle: '按需沟通+月度复盘',
                intro: '资深餐饮顾问，擅长品牌打造'
            },
            {
                id: 5,
                name: '孙七',
                avatar: '👩‍💼',
                title: '零售创业导师',
                industry: '零售/电商',
                experience: 6,
                achievements: '3次创业成功经验',
                specialties: ['商业模式', '资金规划', '团队管理'],
                teachingStyle: '👨‍💼 教练型-引导我思考',
                teachingLevel: '初学者',
                rating: 4.8,
                reviewCount: 72,
                successCases: 12,
                price: 3500,
                communicationStyle: '每周2次视频+随时答疑',
                intro: '连续创业者，擅长从0到1'
            }
        ];
    },

    // 查看导师详情
    viewMentorDetail: function (e) {
        const mentorId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/mentor-detail/mentor-detail?id=${mentorId}`
        });
    },

    // 重新匹配
    rematch: function () {
        this.setData({
            loading: true,
            matchProgress: 0
        });
        this.startMatching();
    }
});
