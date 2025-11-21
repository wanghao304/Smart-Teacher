// pages/mine/index.js
const app = getApp();

Page({
    data: {
        userInfo: null
    },

    onShow() {
        const userInfo = wx.getStorageSync('userInfo');
        this.setData({ userInfo });
    },

    // 退出登录
    logout() {
        wx.clearStorageSync();
        wx.reLaunch({ url: '/pages/login/login' });
    }
});
