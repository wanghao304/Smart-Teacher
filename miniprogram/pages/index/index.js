// index.js
// 首页逻辑
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showGuide: true, // 默认显示引导页（会在onLoad中检测）
        userAvatar: '', // 用户头像
        userName: '新用户', // 用户昵称
        hasProfile: false, // 是否已建立档案
        isPro: false, // 是否为付费会员
        quotaLeft: 3, // 剩余额度
        mentorCount: 0, // 导师数量
        projectCount: 0, // 项目数量
        todayTasks: [] // 今日待办任务
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 检查是否首次使用
        const hasUsed = wx.getStorageSync('hasUsedBefore');
        if (!hasUsed) {
            this.setData({
                showGuide: true
            });
        } else {
            this.loadUserData();
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 每次显示时刷新数据
        if (!this.data.showGuide) {
            this.loadUserData();
            this.loadTodayTasks();
        }
    },

    /**
     * 开始引导
     */
    startGuide: function () {
        // 标记已使用
        wx.setStorageSync('hasUsedBefore', true);

        this.setData({
            showGuide: false
        });

        // 引导用户登录或建立档案
        wx.showModal({
            title: '开始使用',
            content: '让我们先建立您的专属档案吧！',
            confirmText: '立即建立',
            cancelText: '稍后',
            success: (res) => {
                if (res.confirm) {
                    this.goToProfile();
                } else {
                    this.loadUserData();
                }
            }
        });
    },

    /**
     * 加载用户数据
     */
    loadUserData: function () {
        const userInfo = app.globalData.userInfo;
        const hasProfile = app.globalData.hasProfile;
        const isPro = app.globalData.isPro;
        const usageToday = app.globalData.usageToday;

        // 计算剩余额度
        const quotaLeft = isPro ? 999 : Math.max(0, app.globalData.freeQuotaDaily - usageToday);

        // 从缓存获取导师和项目数量
        const mentors = wx.getStorageSync('mentors') || [];
        const projects = wx.getStorageSync('projects') || [];

        this.setData({
            userAvatar: userInfo?.avatarUrl || '',
            userName: userInfo?.nickName || '',
            hasProfile: hasProfile,
            isPro: isPro,
            quotaLeft: quotaLeft,
            mentorCount: mentors.length,
            projectCount: projects.filter(p => p.status === 'active').length
        });
    },

    /**
     * 加载今日待办任务
     */
    loadTodayTasks: function () {
        // 从缓存获取任务
        const allTasks = wx.getStorageSync('tasks') || [];
        const today = new Date().toDateString();

        // 筛选今日任务
        const todayTasks = allTasks.filter(task => {
            const taskDate = new Date(task.deadline).toDateString();
            return taskDate === today && task.status !== 'completed';
        });

        this.setData({
            todayTasks: todayTasks
        });
    },

    /**
     * 跳转到档案页面
     */
    goToProfile: function () {
        wx.navigateTo({
            url: '/pages/profile/profile'
        });
    },

    /**
     * 跳转到AI对话页面
     */
    goToChat: function () {
        // 检查额度
        if (!app.checkQuota()) {
            wx.showModal({
                title: '额度不足',
                content: '今日免费额度已用完，升级Pro会员获得无限次使用！',
                confirmText: '立即升级',
                cancelText: '取消',
                success: (res) => {
                    if (res.confirm) {
                        this.goToMembership();
                    }
                }
            });
            return;
        }

        wx.navigateTo({
            url: '/pages/chat/chat'
        });
    },

    /**
     * 跳转到导师页面
     */
    goToMentors: function () {
        wx.switchTab({
            url: '/pages/mentor/mentor'
        });
    },

    /**
     * 跳转到项目页面
     */
    goToProjects: function () {
        wx.switchTab({
            url: '/pages/project/project'
        });
    },

    /**
     * 跳转到会员页面
     */
    goToMembership: function () {
        wx.navigateTo({
            url: '/pages/membership/membership'
        });
    },

    /**
     * 处理任务点击
     */
    handleTask: function (e) {
        const taskId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/task/task?id=${taskId}`
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const userInfo = app.globalData.userInfo;

        return {
            title: '智导 - 你的专属AI导师团队',
            path: '/pages/index/index',
            imageUrl: '/images/share-banner.png'
        };
    },

    /**
     * 用户点击右上角分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '智导 - 让AI导师团队助你实现目标',
            query: '',
            imageUrl: '/images/share-banner.png'
        };
    }
});
