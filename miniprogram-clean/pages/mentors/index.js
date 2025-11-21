// pages/mentors/index.js
Page({
    data: {
        mentors: [],
        stats: {
            avgRating: 0,
            totalCalls: 0,
            activeMentors: 0
        }
    },

    onShow() {
        this.loadMentors();
    },

    loadMentors() {
        const selected = wx.getStorageSync('selectedMentors') || [];

        // 计算真实数据
        const activeMentors = selected.length;
        // 模拟评分和调用次数（实际应从数据库获取）
        const totalCalls = selected.reduce((sum, m) => sum + (m.calls || 0), 0);
        const avgRating = activeMentors > 0 ? (selected.reduce((sum, m) => sum + (m.rating || 5.0), 0) / activeMentors).toFixed(1) : '0.0';

        this.setData({
            mentors: selected,
            stats: {
                activeMentors,
                totalCalls,
                avgRating
            }
        });
    },

    // 跳转添加导师
    addMentor() {
        wx.navigateTo({ url: '/pages/mentor-create/mentor-create' });
    },

    // 聊天
    chatWithMentor(e) {
        const id = e.currentTarget.dataset.id;
        // 这里可以传递导师ID到聊天页
        wx.navigateTo({ url: '/pages/chat/chat?mentorId=' + id });
    }
});
