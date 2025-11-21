// pages/mentor/mentor.js
const app = getApp();
const { mentorAPI } = require('../../utils/api.js');

Page({
    data: {
        mentors: [],
        recommendedMentors: []
    },

    onLoad: function () {
        this.loadMentors();
    },

    loadMentors: async function () {
        try {
            const userInfo = app.globalData.userInfo;
            const mentors = await mentorAPI.getByUser(userInfo.id);
            this.setData({ mentors });
        } catch (error) {
            console.error('加载导师失败:', error);
        }
    },

    addMentor: function () {
        wx.navigateTo({
            url: '/pages/mentor/add-mentor'
        });
    }
});
