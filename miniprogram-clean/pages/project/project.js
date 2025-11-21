// pages/project/project.js
const app = getApp();

Page({
  data: {
    project: null,
    projectId: '',

    // 项目状态选项
    statusOptions: [
      { value: 'active', label: '进行中', color: '#6366f1' },
      { value: 'success', label: '已完成', color: '#10b981' },
      { value: 'failed', label: '失败', color: '#ef4444' },
      { value: 'abandoned', label: '已放弃', color: '#f59e0b' }
    ],

    // 关联导师
    relatedMentors: [],
    allMentors: [],
    showMentorPicker: false,

    // 进度编辑
    editingProgress: false,
    tempProgress: 0,

    // 聊天记录（与该项目相关）
    projectChats: []
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ projectId: options.id });
      this.loadProjectDetail();
    }
  },

  onShow() {
    if (this.data.projectId) {
      this.loadProjectDetail();
    }
  },

  loadProjectDetail() {
    const projects = wx.getStorageSync('userProjects') || [];
    const project = projects.find(p => p.id === this.data.projectId);

    if (project) {
      this.setData({
        project,
        tempProgress: project.progress || 0
      });
      this.loadRelatedMentors();
      this.loadAllMentors();
      this.loadProjectChats();
    } else {
      wx.showToast({ title: '项目不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  loadRelatedMentors() {
    if (!this.data.project.mentors) return;

    const allMentors = wx.getStorageSync('userMentors') || [];
    const related = this.data.project.mentors.map(mid => {
      return allMentors.find(m => m.id === mid);
    }).filter(m => m);

    this.setData({ relatedMentors: related });
  },

  loadAllMentors() {
    const mentors = wx.getStorageSync('userMentors') || [];
    this.setData({ allMentors: mentors });
  },

  loadProjectChats() {
    // TODO: 从聊天记录中筛选与该项目相关的对话
    const chats = [
      { mentorName: '马斯克', lastMessage: '建议使用第一性原理...', date: '2天前' },
      { mentorName: '乔布斯', lastMessage: '保持简洁，专注用户体验', date: '5天前' }
    ];
    this.setData({ projectChats: chats });
  },

  // 状态变更
  changeStatus(e) {
    const status = e.currentTarget.dataset.status;

    const projects = wx.getStorageSync('userProjects') || [];
    const index = projects.findIndex(p => p.id === this.data.projectId);

    if (index !== -1) {
      projects[index].status = status;
      wx.setStorageSync('userProjects', projects);

      this.setData({
        'project.status': status
      });

      wx.showToast({ title: '状态已更新', icon: 'success' });
    }
  },

  // 进度编辑
  startEditProgress() {
    this.setData({
      editingProgress: true,
      tempProgress: this.data.project.progress || 0
    });
    this.setData({ showMentorPicker: true });
  },

  hideAddMentor() {
    this.setData({ showMentorPicker: false });
  },

  addMentor(e) {
    const mentorId = e.currentTarget.dataset.id;

    const projects = wx.getStorageSync('userProjects') || [];
    const index = projects.findIndex(p => p.id === this.data.projectId);

    if (index !== -1) {
      if (!projects[index].mentors) {
        projects[index].mentors = [];
      }

      if (!projects[index].mentors.includes(mentorId)) {
        projects[index].mentors.push(mentorId);
        wx.setStorageSync('userProjects', projects);

        this.loadProjectDetail();
        this.setData({ showMentorPicker: false });

        wx.showToast({ title: '导师已添加', icon: 'success' });
      } else {
        wx.showToast({ title: '导师已存在', icon: 'none' });
      }
    }
  },

  removeMentor(e) {
    const mentorId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认移除',
      content: '确定移除该导师吗？',
      success: (res) => {
        if (res.confirm) {
          const projects = wx.getStorageSync('userProjects') || [];
          const index = projects.findIndex(p => p.id === this.data.projectId);

          if (index !== -1 && projects[index].mentors) {
            projects[index].mentors = projects[index].mentors.filter(id => id !== mentorId);
            wx.setStorageSync('userProjects', projects);

            this.loadProjectDetail();
            wx.showToast({ title: '已移除', icon: 'success' });
          }
        }
      }
    });
  },

  // 导航到导师详情
  navToMentor(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/mentor-detail/mentor-detail?id=${id}` });
  },

  // 与导师聊天（关联项目）
  chatWithMentor(e) {
    const mentorId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/chat/chat?mentorId=${mentorId}&projectId=${this.data.projectId}`
    });
  },

  // 删除项目
  deleteProject() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该项目吗？此操作不可恢复！',
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          const projects = wx.getStorageSync('userProjects') || [];
          const newProjects = projects.filter(p => p.id !== this.data.projectId);
          wx.setStorageSync('userProjects', newProjects);

          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => {
            wx.switchTab({ url: '/pages/projects/index' });
          }, 1500);
        }
      }
    });
  }
});