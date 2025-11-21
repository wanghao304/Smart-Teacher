// pages/profile/profile.js
const app = getApp();
const { profileAPI, chatAPI } = require('../../utils/api.js');

Page({
    data: {
        step: 1, // 当前步骤
        totalSteps: 5, // 总步骤数

        // 步骤1：心理与人格
        personalityType: '',
        personalityTraits: [],

        // 步骤2：做事风格
        decisionPreference: '',
        actionLevel: 5,

        // 步骤3：资源盘点
        resources: {
            contacts: [],
            skills: [],
            budget: { min: 0, max: 0 },
            time: 0
        },

        // 步骤4：认知边界
        cognitionLevel: 5,

        // 步骤5：项目意向
        projectGoal: '',
        projectIdea: ''
    },

    onLoad: function () {
        // 检查是否已有档案
        this.loadExistingProfile();
    },

    loadExistingProfile: function () {
        const userInfo = app.globalData.userInfo;
        if (!userInfo) return;

        // TODO: 从Supabase加载已有档案
    },

    // 下一步
    nextStep: function () {
        if (this.data.step < this.data.totalSteps) {
            this.setData({
                step: this.data.step + 1
            });
        } else {
            this.submitProfile();
        }
    },

    // 上一步
    prevStep: function () {
        if (this.data.step > 1) {
            this.setData({
                step: this.data.step - 1
            });
        }
    },

    // 提交档案
    submitProfile: async function () {
        app.showLoading('正在保存档案...');

        try {
            const profileData = {
                user_id: app.globalData.userInfo.id,
                personality_type: this.data.personalityType,
                personality_traits: this.data.personalityTraits,
                execution_style: {
                    decision: this.data.decisionPreference,
                    action: this.data.actionLevel
                },
                resources: this.data.resources,
                cognition_level: this.data.cognitionLevel
            };

            await profileAPI.create(profileData);

            app.globalData.hasProfile = true;
            app.hideLoading();
            app.showToast('档案保存成功！', 'success');

            // 跳转到首页
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/index/index'
                });
            }, 1500);

        } catch (error) {
            app.hideLoading();
            app.showToast('保存失败，请重试');
            console.error('档案保存失败:', error);
        }
    }
});
