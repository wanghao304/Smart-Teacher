// pages/membership/membership.js
// 会员中心页面
const app = getApp();

Page({
    data: {
        isPro: false,
        usageToday: 0,
        quotaDaily: 3,
        membershipInfo: null
    },

    onLoad: function () {
        this.loadMembershipInfo();
    },

    onShow: function () {
        this.loadMembershipInfo();
    },

    /**
     * 加载会员信息
     */
    loadMembershipInfo: function () {
        const membershipData = wx.getStorageSync('membership') || {};

        this.setData({
            isPro: app.globalData.isPro,
            usageToday: app.globalData.usageToday,
            quotaDaily: app.globalData.freeQuotaDaily,
            membershipInfo: membershipData
        });
    },

    /**
     * 购买Pro会员
     */
    buyProMembership: function () {
        wx.showModal({
            title: '购买Pro会员',
            content: '¥9.9/年，无限次AI对话，解锁全部功能！',
            confirmText: '立即购买',
            success: (res) => {
                if (res.confirm) {
                    this.processPurchase();
                }
            }
        });
    },

    /**
     * 处理购买
     */
    processPurchase: function () {
        // TODO: 接入微信支付
        wx.showLoading({ title: '处理中...' });

        // 模拟支付流程
        setTimeout(() => {
            wx.hideLoading();

            // 更新会员状态
            app.globalData.isPro = true;

            const membershipData = {
                isPro: true,
                tier: 'pro',
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                usageToday: 0
            };

            wx.setStorageSync('membership', membershipData);

            this.setData({
                isPro: true,
                membershipInfo: membershipData
            });

            wx.showToast({
                title: '购买成功！',
                icon: 'success'
            });
        }, 1500);
    },

    /**
     * 邀请好友
     */
    inviteFriends: function () {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    /**
     * 分享
     */
    onShareAppMessage: function () {
        const userInfo = app.globalData.userInfo;
        return {
            title: '智导 - 你的专属AI导师团队',
            path: '/pages/index/index?inviter=' + (userInfo?.id || ''),
            imageUrl: '/images/share-banner.png'
        };
    }
});
