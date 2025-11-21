// pages/project-create/project-create.js
const app = getApp();

Page({
    data: {
        mode: 'natural', // natural | structured

        // 自然语言模式
        naturalInput: '',
        parsing: false,

        // 结构化模式
        project: {
            name: '',
            description: '',
            targetDate: '',
            difficulty: 'medium', // easy | medium | hard
            category: '',
            skills: [],
            expectedOutput: ''
        },

        // AI解析后的数据
        parsedProject: null,

        // 选项
        difficultyOptions: [
            { value: 'easy', label: '简单' },
            { value: 'medium', label: '中等' },
            { value: 'hard', label: '困难' }
        ],
        categoryOptions: [
            '产品开发', '技术学习', '商业分析', '内容创作',
            '市场调研', '技能提升', '副业启动', '其他'
        ]
    },

    // 切换模式
    toggleMode(e) {
        const mode = e.currentTarget.dataset.mode;
        this.setData({ mode });
    },

    // 自然语言输入
    onNaturalInput(e) {
        this.setData({ naturalInput: e.detail.value });
    },

    // AI解析自然语言
    parseNaturalInput() {
        if (!this.data.naturalInput.trim()) {
            return wx.showToast({ title: '请输入项目描述', icon: 'none' });
        }

        this.setData({ parsing: true });
        wx.showLoading({ title: 'AI解析中...', mask: true });

        // TODO: 调用后端AI API
        setTimeout(() => {
            const parsed = this.mockAIParse(this.data.naturalInput);

            this.setData({
                parsedProject: parsed,
                parsing: false
            });

            wx.hideLoading();

            // 显示确认弹窗
            wx.showModal({
                title: '解析完成',
                content: `项目：${parsed.name}\n难度：${parsed.difficulty}\n是否确认创建？`,
                success: (res) => {
                    if (res.confirm) {
                        this.saveProject(parsed);
                    }
                }
            });
        }, 2000);
    },

    // Mock AI解析
    mockAIParse(input) {
        // 简单的关键词匹配逻辑，实际应调用后端AI
        const project = {
            name: '未命名项目',
            description: input,
            difficulty: 'medium',
            category: '其他',
            skills: [],
            expectedOutput: '',
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString()
        };

        // 提取项目名称
        const nameMatch = input.match(/(?:开发|制作|创建|学习|完成)(.{2,20})/);
        if (nameMatch) {
            project.name = nameMatch[1].trim();
        }

        // 判断难度
        if (input.includes('简单') || input.includes('入门')) {
            project.difficulty = 'easy';
        } else if (input.includes('困难') || input.includes('复杂') || input.includes('高级')) {
            project.difficulty = 'hard';
        }

        // 判断类别
        if (input.includes('开发') || input.includes('编程')) {
            project.category = '产品开发';
        } else if (input.includes('学习') || input.includes('掌握')) {
            project.category = '技术学习';
        } else if (input.includes('分析') || input.includes('调研')) {
            project.category = '商业分析';
        } else if (input.includes('写作') || input.includes('内容')) {
            project.category = '内容创作';
        }

        // 提取技能
        const skills = [];
        const skillKeywords = ['Python', 'Java', 'AI', '数据分析', '产品设计', '市场营销', '写作', '演讲'];
        skillKeywords.forEach(skill => {
            if (input.includes(skill)) {
                skills.push(skill);
            }
        });
        project.skills = skills;

        return project;
    },

    // 结构化输入
    onFieldInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({
            [`project.${field}`]: e.detail.value
        });
    },

    onDifficultyChange(e) {
        this.setData({
            'project.difficulty': this.data.difficultyOptions[e.detail.value].value
        });
    },

    onCategoryChange(e) {
        this.setData({
            'project.category': this.data.categoryOptions[e.detail.value]
        });
    },

    onDateChange(e) {
        this.setData({
            'project.targetDate': e.detail.value
        });
    },

    // 创建结构化项目
    createStructuredProject() {
        const { name, description } = this.data.project;

        if (!name || !description) {
            return wx.showToast({ title: '请填写必填项', icon: 'none' });
        }

        const project = {
            ...this.data.project,
            id: `proj_${Date.now()}`,
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString()
        };

        this.saveProject(project);
    },

    // 保存项目
    saveProject(project) {
        const projects = wx.getStorageSync('userProjects') || [];
        projects.push(project);
        wx.setStorageSync('userProjects', projects);

        wx.showToast({
            title: '项目创建成功',
            icon: 'success',
            duration: 2000
        });

        setTimeout(() => {
            wx.switchTab({ url: '/pages/projects/index' });
        }, 2000);
    },

    // 取消
    cancel() {
        wx.navigateBack();
    }
});
