// pages/login/login.js
const app = getApp();

Page({
    data: {
        loginMode: 'wechat', // wechat | phone | admin
        phone: '',
        code: '',
        adminAccount: '',
        adminPassword: '',
        countdown: 0,
        loading: false
    },

    // 切换登录模式
    switchMode(e) {
        const mode = e.currentTarget.dataset.mode;
        this.setData({ loginMode: mode });
    },

    // 微信一键登录
    wechatLogin() {
        this.setData({ loading: true });
        
        // 获取微信登录 code
        wx.login({
            success: res => {
                if (res.code) {
                    // 获取用户信息（需要用户授权）
                    wx.getUserProfile({
                        desc: '用于完善用户资料',
                        success: profileRes => {
                            // 登录成功，保存用户信息
                            const userInfo = {
                                nickname: profileRes.userInfo.nickName,
                                avatar: profileRes.userInfo.avatarUrl,
                                id: 'wx_' + Date.now(),
                                openid: app.globalData.openid || 'wx_' + Date.now()
                            };
                            
                            // 更新全局 openid（如果还没有）
                            if (!app.globalData.openid) {
                                app.globalData.openid = userInfo.id;
                                wx.setStorageSync('openid', userInfo.id);
                            }
                            
                            this.loginSuccess(userInfo);
                        },
                        fail: () => {
                            // 用户拒绝授权，使用默认信息
                            const userInfo = {
                                nickname: '微信用户',
                                avatar: '',
                                id: app.globalData.openid || 'wx_' + Date.now(),
                                openid: app.globalData.openid || 'wx_' + Date.now()
                            };
                            
                            if (!app.globalData.openid) {
                                app.globalData.openid = userInfo.id;
                                wx.setStorageSync('openid', userInfo.id);
                            }
                            
                            this.loginSuccess(userInfo);
                        }
                    });
                } else {
                    this.setData({ loading: false });
                    wx.showToast({ title: '登录失败，请重试', icon: 'none' });
                }
            },
            fail: err => {
                console.error('微信登录失败:', err);
                this.setData({ loading: false });
                wx.showToast({ title: '登录失败，请重试', icon: 'none' });
            }
        });
    },

    // 获取验证码
    sendCode() {
        if (!this.data.phone || this.data.phone.length !== 11) {
            wx.showToast({ title: '请输入正确手机号', icon: 'none' });
            return;
        }

        this.setData({ countdown: 60 });
        const timer = setInterval(() => {
            if (this.data.countdown <= 0) {
                clearInterval(timer);
            } else {
                this.setData({ countdown: this.data.countdown - 1 });
            }
        }, 1000);

        wx.showToast({ title: '验证码已发送: 1234', icon: 'none' });
    },

    // 手机号登录
    phoneLogin() {
        if (!this.data.phone || !this.data.code) {
            wx.showToast({ title: '请填写完整信息', icon: 'none' });
            return;
        }

        this.setData({ loading: true });
        // 模拟验证
        setTimeout(() => {
            this.loginSuccess({
                nickname: '用户' + this.data.phone.slice(-4),
                id: 'ph_' + this.data.phone
            });
        }, 1000);
    },

    // 管理员登录
    adminLogin() {
        if (this.data.adminAccount === 'admin' && this.data.adminPassword === '123456') {
            wx.showToast({ title: '管理员登录成功', icon: 'success' });
            // 这里可以跳转到管理员专属页面，或者赋予管理员权限
            // 暂时跳转首页，但在全局变量中标记
            app.globalData.isAdmin = true;
            setTimeout(() => {
                wx.switchTab({ url: '/pages/index/index' });
            }, 1000);
        } else {
            wx.showToast({ title: '账号或密码错误', icon: 'none' });
        }
    },

    // 登录成功处理
    loginSuccess(userInfo) {
        wx.setStorageSync('userInfo', userInfo);
        wx.showToast({ title: '登录成功', icon: 'success' });

        // 判断是否是新用户 (这里简单判定：如果没有档案就是新用户)
        const profile = wx.getStorageSync('userProfile');
        if (!profile) {
            wx.redirectTo({ url: '/pages/intro/intro' });
        } else {
            wx.switchTab({ url: '/pages/index/index' });
        }
    }
});
