// app.js
App({
    globalData: {
        userInfo: null,
        openid: null,
        hasProfile: false,
        isPro: false,
        usageToday: 0,
        freeQuotaDaily: 3,
        // Supabase 项目配置（已在 app.js 中声明）
        apiBaseUrl: 'https://abigvhvncuaajpesfagy.supabase.co',
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWd2aHZuY3VhYWpwZXNmYWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjgyODgsImV4cCI6MjA3ODY0NDI4OH0.yhnS9FhfqPdsLiBghc-hzug-Z06XMXuQazFvjSDu_Bg',
        doubaoApiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        doubaoApiKey: '361fc5ee-74d8-45cf-bc70-3685385fddf3'
    },

    // ---------- 应用启动 ----------
    onLaunch() {
        console.log('App Launch');
        // Supabase 配置已存储在 globalData 中，实际请求在 utils/supabase.js 中完成
        
        // 检查本地是否已有 openid
        const savedOpenid = wx.getStorageSync('openid');
        if (savedOpenid) {
            this.globalData.openid = savedOpenid;
            console.log('Loaded openid from storage:', savedOpenid);
            // 如果已有用户数据，尝试同步
            this.syncUserData();
        } else {
            // 微信登录获取 code（用于后续换取 openid，需要后端支持）
            // 注意：微信小程序的 code 不能直接用于 Supabase OAuth
            // 这里先获取 code，实际的 openid 获取应该在登录页面完成
            wx.login({
                success: res => {
                    if (res.code) {
                        // 保存 code，等待用户主动登录时使用
                        // 实际的 openid 获取应该在登录页面通过后端接口完成
                        console.log('Got WeChat code:', res.code);
                        // 暂时使用 code 作为临时标识（实际应该通过后端换取 openid）
                        // 这里为了演示，使用时间戳生成一个临时 ID
                        const tempId = 'wx_' + Date.now();
                        this.globalData.openid = tempId;
                        wx.setStorageSync('openid', tempId);
                    }
                },
                fail: err => {
                    console.error('WeChat login failed:', err);
                }
            });
        }

        // 获取用户信息（如果已授权）
        wx.getSetting({
            success: setRes => {
                if (setRes.authSetting && setRes.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: infoRes => {
                            this.globalData.userInfo = infoRes.userInfo;
                            this.globalData.hasProfile = true;
                        },
                        fail: () => {
                            console.warn('获取用户信息失败，可能未授权');
                        }
                    });
                }
            }
        });
    },

    // ---------- 同步用户数据到云端（Supabase） ----------
    /**
     * 将本地的用户数据（如 mentors、projects、chat histories）同步到 Supabase 表。
     * 这里提供一个通用的 upsert 方法，实际业务可根据需要调用。
     */
    syncUserData() {
        const openid = this.globalData.openid;
        if (!openid) return;
        
        // 获取 supabase 工具函数
        const { upsert } = require('./utils/supabase.js');
        
        // 示例：同步 mentors 表（如果本地有 mentors 数据）
        const mentors = wx.getStorageSync('userMentors') || [];
        if (mentors.length) {
            mentors.forEach(m => {
                // 使用 upsert（插入或更新）
                upsert('mentors', { 
                    id: m.id, 
                    user_id: openid,
                    ...m 
                })
                    .then(() => console.log('Mentor sync success', m.id))
                    .catch(err => console.error('Mentor sync error', err));
            });
        }
        // 同步 projects
        const projects = wx.getStorageSync('userProjects') || [];
        if (projects.length) {
            projects.forEach(p => {
                upsert('projects', { 
                    id: p.id, 
                    user_id: openid,
                    ...p 
                })
                    .then(() => console.log('Project sync success', p.id))
                    .catch(err => console.error('Project sync error', err));
            });
        }
        // 同步聊天记录（示例存储在 chats 表）
        // 这里省略实现细节，实际可遍历所有 chat_* 键并 upsert 到云端。
    },

    // ---------- 配额检查 ----------
    checkQuota() {
        if (this.globalData.isPro) return true;
        return this.globalData.usageToday < this.globalData.freeQuotaDaily;
    },

    increaseUsage() {
        this.globalData.usageToday++;
    }
});
