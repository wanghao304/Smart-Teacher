// pages/share/share.js
const app = getApp();
const { shareAPI } = require('../../utils/api.js');

Page({
    data: {
        shareCode: '',
        projectInfo: null
    },

    onLoad: function (options) {
        if (options.code) {
            this.loadSharedProject(options.code);
        }
    },

    loadSharedProject: async function (code) {
        try {
            // TODO: 加载分享的项目信息
            console.log('加载分享项目:', code);
        } catch (error) {
            console.error('加载失败:', error);
        }
    },

    joinProject: function () {
        wx.showToast({
            title: '加入成功！',
            icon: 'success'
        });
    }
});
