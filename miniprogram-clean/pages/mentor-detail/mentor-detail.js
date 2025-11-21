// pages/mentor-detail/mentor-detail.js
const app = getApp();

Page({
  data: {
    mentor: null,
    mentorId: '',

    // 数据统计
    stats: {
      chatCount: 0,
      totalMessages: 0,
      avgResponseTime: 0,
      lastChatDate: ''
    },

    // 关键话题
    keyTopics: [],

    // 编辑模式
    editing: false,
    editData: {},

    // 头像选择
    showAvatarPicker: false,
    avatarEmojis: ['👨‍🏫', '👩‍🏫', '🧑‍💼', '👨‍💻', '👩‍💻', '🧙‍♂️', '🧙‍♀️', '👨‍🎨', '👩‍🎨', '🦸‍♂️', '🦸‍♀️', '🤖', '🎓', '💼', '📚', '🚀', '💡', '⭐', '🔥', '✨']
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ mentorId: options.id });
      this.loadMentorDetail();
    }
  },

  loadMentorDetail() {
    const mentors = wx.getStorageSync('userMentors') || [];
    const mentor = mentors.find(m => m.id === this.data.mentorId);

    if (mentor) {
      this.setData({
        mentor,
        editData: { ...mentor }
      });
      this.loadStats();
      this.loadKeyTopics();
    } else {
      wx.showToast({
        title: '导师不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  loadStats() {
    // TODO: 从聊天记录中计算真实数据
    // 现在使用mock数据
    const stats = {
      chatCount: Math.floor(Math.random() * 20) + 5,
      totalMessages: Math.floor(Math.random() * 100) + 20,
      avgResponseTime: (Math.random() * 3 + 1).toFixed(1),
      lastChatDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
    this.setData({ stats });
  },

  loadKeyTopics() {
    // TODO: AI分析聊天记录提取关键话题
    // 现在使用mock数据
    const topics = [
      { name: '职业规划', count: 8, trend: 'up' },
      { name: '技能提升', count: 5, trend: 'stable' },
      { name: '项目管理', count: 3, trend: 'down' }
    ];
    this.setData({ keyTopics: topics });
  },

  // 开始编辑
  startEdit() {
    this.setData({
      editing: true,
      editData: { ...this.data.mentor }
    });
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      editing: false,
      editData: { ...this.data.mentor }
    });
  },

  // 输入变化
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`editData.${field}`]: e.detail.value
    });
  },

  // 保存编辑
  saveEdit() {
    const { editData } = this.data;

    if (!editData.name || !editData.field) {
      return wx.showToast({ title: '请填写必填项', icon: 'none' });
    }

    const mentors = wx.getStorageSync('userMentors') || [];
    const index = mentors.findIndex(m => m.id === this.data.mentorId);

    if (index !== -1) {
      mentors[index] = editData;
      wx.setStorageSync('userMentors', mentors);

      this.setData({
        mentor: editData,
        editing: false
      });

      wx.showToast({ title: '保存成功', icon: 'success' });
    }
  },

  // 显示头像选择器
  showAvatarSelector() {
    this.setData({ showAvatarPicker: true });
  },

  hideAvatarSelector() {
    this.setData({ showAvatarPicker: false });
  },

  // 选择头像
  selectAvatar(e) {
    const avatar = e.currentTarget.dataset.avatar;
    this.setData({
      'editData.avatar': avatar,
      showAvatarPicker: false
    });
  },

  // 上传自定义头像
  uploadAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];

        wx.showLoading({ title: '上传中...' });

        // TODO: 上传到服务器
        // 现在暂时使用本地路径
        setTimeout(() => {
          this.setData({
            'editData.avatar': tempFilePath,
            showAvatarPicker: false
          });
          wx.hideLoading();
          wx.showToast({ title: '上传成功', icon: 'success' });
        }, 1000);
      }
    });
  },

  // 删除导师
  deleteMentor() {
    wx.showModal({
      title: '确认删除',
      content: `确定要删除导师"${this.data.mentor.name}"吗？此操作不可恢复！`,
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          const mentors = wx.getStorageSync('userMentors') || [];
          const newMentors = mentors.filter(m => m.id !== this.data.mentorId);
          wx.setStorageSync('userMentors', newMentors);

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });

          setTimeout(() => {
            wx.switchTab({ url: '/pages/mentors/index' });
          }, 1500);
        }
      }
    });
  },

  // 导出聊天记录
  exportChat() {
    wx.showLoading({ title: '生成中...' });

    // TODO: 实际导出聊天记录
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出成功',
        content: '聊天记录已保存到相册',
        showCancel: false
      });
    }, 2000);
  },

  // 开始聊天
  startChat() {
    wx.navigateTo({
      url: `/pages/chat/chat?mentorId=${this.data.mentorId}`
    });
  },

  // 查看方法论详情
  viewMethodology() {
    wx.showModal({
      title: '核心方法论',
      content: this.data.mentor.methodology || '暂无方法论',
      showCancel: false
    });
  }
});