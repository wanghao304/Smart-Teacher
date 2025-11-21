// pages/intro/intro.js
Page({
    data: {
        current: 0
    },

    onSlideChange(e) {
        this.setData({ current: e.detail.current });
    },

    nextSlide() {
        const next = this.data.current + 1;
        if (next < 3) { // 总共3页 (0, 1, 2)
            this.setData({ current: next });
        }
    },

    startProfile() {
        wx.navigateTo({ url: '/pages/profile/profile' });
    }
});
