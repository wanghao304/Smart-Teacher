// pages/projects/index.js
Page({
    data: {
        projects: []
    },

    onShow() {
        const projects = wx.getStorageSync('projects') || [];
        this.setData({ projects });
    }
});
