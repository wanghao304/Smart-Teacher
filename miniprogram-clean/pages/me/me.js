// pages/me/me.js
const app = getApp();

Page({
    data: {
        userInfo: {
            avatar: '',
            nickname: '未登录',
            identity: '普通会员',
            memberLevel: 0 // 0普通 1月度 2年度 3永久
        },
        stats: {
            projects: 0,
            mentors: 0,
            studyDays: 0,
            achievements: 0
        }
    },

    onLoad() {
        this.loadUserData();
    },

    onShow() {
        this.loadUserData();
    },

    loadUserData() {
        // 从storage读取用户信息
        const profile = wx.getStorageSync('userProfile') || {};
        const projects = wx.getStorageSync('userProjects') || [];
        const mentors = wx.getStorageSync('userMentors') || [];

        // 计算学习天数
        const startDate = wx.getStorageSync('studyStartDate') || Date.now();
        const studyDays = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

        this.setData({
            'userInfo.nickname': profile.currentRole || '未设置昵称',
            'userInfo.identity': profile.currentIndustry || '智导学员',
            'stats.projects': projects.length,
            'stats.mentors': mentors.length,
            'stats.studyDays': studyDays >= 0 ? studyDays : 0,
            'stats.achievements': Math.floor((projects.length + mentors.length) / 2)
        });
    },

    // 导航方法
    goToMyProjects() {
        wx.switchTab({ url: '/pages/projects/index' });
    },

    goToMyMentors() {
        wx.switchTab({ url: '/pages/mentors/index' });
    },

    goToMember() {
        wx.showModal({
            title: '会员中心',
            content: '会员功能即将上线，敬请期待！',
            showCancel: false
        });
    },

    goToWallet() {
        wx.showModal({
            title: '我的钱包',
            content: '钱包功能开发中...',
            showCancel: false
        });
    },

    goToOrders() {
        wx.showModal({
            title: '订单记录',
            content: '订单功能开发中...',
            showCancel: false
        });
    },

    goToFriends() {
        wx.showModal({
            title: '我的好友',
            content: '社交功能开发中...',
            showCancel: false
        });
    },

    goToInvite() {
        wx.showShareMenu({
            withShareTicket: true,
            success: () => {
                wx.showToast({ title: '邀请好友吧！', icon: 'none' });
            }
        });
    },

    goToShare() {
        wx.showShareMenu({
            withShareTicket: true,
            success: () => {
                wx.showToast({ title: '分享给好友', icon: 'none' });
            }
        });
    },

    goToLearningPath() {
        // 跳转到学习历程页面
        wx.navigateTo({ url: '/pages/profile-view/profile-view' });
    },

    goToCollection() {
        wx.showToast({ title: '收藏功能开发中', icon: 'none' });
    },

    goToMessages() {
        wx.switchTab({ url: '/pages/index/index' });
    },

    goToSettings() {
        wx.navigateTo({ url: '/pages/profile-view/profile-view' });
    },

    goToHelp() {
        wx.showModal({
            title: '帮助中心',
            content: '使用说明：\n1. 完善个人档案\n2. 创建导师团队\n3. 启动学习项目\n4. 与导师对话获取指导',
            showCancel: false
        });
    },

    goToFeedback() {
        wx.showModal({
            title: '意见反馈',
            content: '感谢您的反馈！请发送邮件至：feedback@smartteacher.com',
            showCancel: false
        });
    },

    goToAbout() {
        wx.showModal({
            title: '关于智导',
            content: '智导 - AI驱动的个性化导师系统\n版本：V1.0.0\n\n让每个人都拥有专属智囊团',
            showCancel: false
        });
    }
});
