// pages/index/index.js
const app = getApp();

Page({
    data: {
        // B区数据统计
        stats: {
            totalProjects: 0,
            totalMentors: 0,
            successProjects: 0,
            failedProjects: 0,
            abandonedProjects: 0,
            studyDays: 0
        },

        // A区当前项目
        currentProject: null,
        hasProjects: false,

        // D区对话框
        selectedMentor: null,
        mentors: [],
        inputMode: 'text', // text | voice
        messageContent: ''
    },

    onLoad() {
        this.loadUserData();
    },

    onShow() {
        this.loadUserData();
    },

    loadUserData() {
        // 加载统计数据
        const projects = wx.getStorageSync('userProjects') || [];
        const mentors = wx.getStorageSync('userMentors') || [];

        const stats = {
            totalProjects: projects.length,
            totalMentors: mentors.length,
            successProjects: projects.filter(p => p.status === 'success').length,
            failedProjects: projects.filter(p => p.status === 'failed').length,
            abandonedProjects: projects.filter(p => p.status === 'abandoned').length,
            studyDays: this.calculateStudyDays()
        };

        // 获取当前执行的项目（status为'active'的第一个）
        const currentProject = projects.find(p => p.status === 'active') || null;

        this.setData({
            stats,
            currentProject,
            hasProjects: projects.length > 0,
            mentors,
            selectedMentor: mentors[0] || null
        });
    },

    calculateStudyDays() {
        const startDate = wx.getStorageSync('studyStartDate');
        if (!startDate) return 0;

        const days = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        return days >= 0 ? days : 0;
    },

    // B区：点击统计卡片跳转
    navToProjects(e) {
        const type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: `/pages/projects/index?type=${type}`
        });
    },

    navToMentors() {
        wx.switchTab({ url: '/pages/mentors/index' });
    },

    // A区：点击项目卡片
    viewProjectDetail() {
        if (this.data.currentProject) {
            wx.navigateTo({
                url: `/pages/project/project?id=${this.data.currentProject.id}`
            });
        }
    },

    // C区：快捷操作
    createMentor() {
        wx.navigateTo({ url: '/pages/mentor-create/mentor-create' });
    },

    updateProfile() {
        // 跳转到资料看板而非重新采集
        wx.navigateTo({ url: '/pages/profile-view/profile-view' });
    },

    createProject() {
        wx.navigateTo({ url: '/pages/project-create/project-create' });
    },

    // D区：导师选择
    selectMentor(e) {
        const index = e.detail.value;
        this.setData({ selectedMentor: this.data.mentors[index] });
    },

    // D区：切换输入模式
    toggleInputMode() {
        const mode = this.data.inputMode === 'text' ? 'voice' : 'text';
        this.setData({ inputMode: mode });
        wx.showToast({
            title: mode === 'text' ? '文字模式' : '语音模式',
            icon: 'none'
        });
    },

    // D区：消息输入
    onMessageInput(e) {
        this.setData({ messageContent: e.detail.value });
    },

    // D区：发送消息
    sendMessage() {
        const { messageContent, selectedMentor } = this.data;

        if (!selectedMentor) {
            return wx.showToast({ title: '请先选择导师', icon: 'none' });
        }

        if (!messageContent.trim()) {
            return wx.showToast({ title: '请输入内容', icon: 'none' });
        }

        // 跳转到聊天页面
        wx.navigateTo({
            url: `/pages/chat/chat?mentorId=${selectedMentor.id}&message=${encodeURIComponent(messageContent)}`
        });
    },

    // D区：上传附件
    uploadAttachment() {
        wx.showActionSheet({
            itemList: ['图片', '视频', '文件'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    this.chooseImage();
                } else if (res.tapIndex === 1) {
                    this.chooseVideo();
                } else if (res.tapIndex === 2) {
                    this.chooseFile();
                }
            }
        });
    },

    chooseImage() {
        wx.chooseImage({
            count: 9,
            success: (res) => {
                wx.showToast({ title: '图片已选择', icon: 'success' });
                // TODO: 处理图片上传
            }
        });
    },

    chooseVideo() {
        wx.chooseVideo({
            success: (res) => {
                wx.showToast({ title: '视频已选择', icon: 'success' });
                // TODO: 处理视频上传
            }
        });
    },

    chooseFile() {
        wx.chooseMessageFile({
            count: 5,
            type: 'file',
            success: (res) => {
                wx.showToast({ title: '文件已选择', icon: 'success' });
                // TODO: 处理文件上传
            }
        });
    }
});
