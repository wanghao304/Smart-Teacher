// pages/project/project.js
const app = getApp();
const { projectAPI } = require('../../utils/api.js');

Page({
    data: {
        projects: []
    },

    onLoad: function () {
        this.loadProjects();
    },

    loadProjects: async function () {
        try {
            const userInfo = app.globalData.userInfo;
            const projects = await projectAPI.getByUser(userInfo.id);
            this.setData({ projects });
        } catch (error) {
            console.error('加载项目失败:', error);
        }
    },

    createProject: function () {
        wx.navigateTo({
            url: '/pages/project/create-project'
        });
    }
});
