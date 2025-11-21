// 全局应用程序实例
App({
    // 全局数据
    globalData: {
        userInfo: null, // 用户信息
        hasProfile: false, // 是否完成档案建立
        mentors: [], // 导师列表
        currentProject: null, // 当前项目
        apiBaseUrl: 'https://abigvhvncuaajpesfagy.supabase.co', // Supabase URL
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWd2aHZuY3VhYWpwZXNmYWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjgyODgsImV4cCI6MjA3ODY0NDI4OH0.yhnS9FhfqPdsLiBghc-hzug-Z06XMXuQazFvjSDu_Bg', // Supabase Anon Public Key ✅已配置
        doubaoApiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', // 豆包API地址
        doubaoApiKey: '361fc5ee-74d8-45cf-bc70-3685385fddf3', // 豆包API密钥
        freeQuotaDaily: 3, // 免费用户每日额度
        isPro: false, // 是否为付费会员
        usageToday: 0 // 今日已使用次数
    },

    /**
     * 应用启动时执行
     */
    onLaunch: function () {
        console.log('Smart Teacher 小程序启动');

        // 检查本地存储的用户信息
        this.checkUserData();

        // 检查更新
        this.checkUpdate();
    },

    /**
     * 检查用户数据
     */
    checkUserData: function () {
        const userData = wx.getStorageSync('userInfo');
        const profileData = wx.getStorageSync('userProfile');
        const membershipData = wx.getStorageSync('membership');

        if (userData) {
            this.globalData.userInfo = userData;
        }

        if (profileData) {
            this.globalData.hasProfile = true;
        }

        if (membershipData) {
            this.globalData.isPro = membershipData.isPro;
            this.globalData.usageToday = membershipData.usageToday || 0;
        }
    },

    /**
     * 检查小程序更新
     */
    checkUpdate: function () {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager();

            updateManager.onCheckForUpdate(function (res) {
                console.log('检查更新结果:', res.hasUpdate);
            });

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                });
            });

            updateManager.onUpdateFailed(function () {
                console.error('新版本下载失败');
            });
        }
    },

    /**
     * 显示加载提示
     */
    showLoading: function (title = '加载中...') {
        wx.showLoading({
            title: title,
            mask: true
        });
    },

    /**
     * 隐藏加载提示
     */
    hideLoading: function () {
        wx.hideLoading();
    },

    /**
     * 显示消息提示
     */
    showToast: function (title, icon = 'none', duration = 2000) {
        wx.showToast({
            title: title,
            icon: icon,
            duration: duration
        });
    },

    /**
     * 检查是否还有使用额度
     */
    checkQuota: function () {
        if (this.globalData.isPro) {
            return true; // 付费用户无限制
        }

        return this.globalData.usageToday < this.globalData.freeQuotaDaily;
    },

    /**
     * 增加使用次数
     */
    increaseUsage: function () {
        this.globalData.usageToday++;

        // 保存到本地存储
        const membershipData = {
            isPro: this.globalData.isPro,
            usageToday: this.globalData.usageToday,
            date: new Date().toDateString()
        };

        wx.setStorageSync('membership', membershipData);
    },

    /**
     * 重置每日使用次数（每天凌晨调用）
     */
    resetDailyUsage: function () {
        this.globalData.usageToday = 0;

        const membershipData = {
            isPro: this.globalData.isPro,
            usageToday: 0,
            date: new Date().toDateString()
        };

        wx.setStorageSync('membership', membershipData);
    }
});
