// pages/calendar/calendar.js
const app = getApp();
const { taskAPI } = require('../../utils/api.js');

Page({
    data: {
        currentDate: '',
        tasks: []
    },

    onLoad: function () {
        const today = new Date();
        this.setData({
            currentDate: today.toISOString().split('T')[0]
        });
        this.loadTasks();
    },

    loadTasks: async function () {
        try {
            const userInfo = app.globalData.userInfo;
            const tasks = await taskAPI.getByUser(userInfo.id);
            this.setData({ tasks });
        } catch (error) {
            console.error('加载任务失败:', error);
        }
    }
});
