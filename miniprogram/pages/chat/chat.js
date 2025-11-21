// pages/chat/chat.js
// AI对话页面
const app = getApp();
const { chatAPI } = require('../../utils/api.js');

Page({
    data: {
        messages: [], // 对话消息列表
        inputText: '', // 输入框文本
        isLoading: false, // 加载状态
        sessionId: '' // 会话ID
    },

    onLoad: function (options) {
        // 生成会话ID
        this.setData({
            sessionId: `session_${Date.now()}`
        });

        // 加载历史消息
        this.loadHistory();
    },

    /**
       * 加载历史消息
       */
    loadHistory: function () {
        // 从缓存加载
        const history = wx.getStorageSync(`chat_${this.data.sessionId}`) || [];
        this.setData({ messages: history });
    },

    /**
     * 输入框变化
     */
    onInput: function (e) {
        this.setData({
            inputText: e.detail.value
        });
    },

    /**
     * 发送消息
     */
    sendMessage: async function () {
        const text = this.data.inputText.trim();
        if (!text) {
            wx.showToast({ title: '请输入内容', icon: 'none' });
            return;
        }

        // 检查额度
        if (!app.checkQuota()) {
            wx.showModal({
                title: '额度不足',
                content: '今日免费额度已用完，升级Pro会员获得无限次使用！',
                confirmText: '立即升级',
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({ url: '/pages/membership/membership' });
                    }
                }
            });
            return;
        }

        // 添加用户消息到界面
        const userMsg = {
            role: 'user',
            content: text,
            time: new Date().toLocaleTimeString()
        };

        this.setData({
            messages: [...this.data.messages, userMsg],
            inputText: '',
            isLoading: true
        });

        try {
            // 调用AI
            const messages = [
                ...this.data.messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: text }
            ];

            const response = await chatAPI.send(messages);

            // 添加AI回复
            const aiMsg = {
                role: 'assistant',
                content: response.choices[0].message.content,
                time: new Date().toLocaleTimeString()
            };

            this.setData({
                messages: [...this.data.messages, aiMsg],
                isLoading: false
            });

            // 保存到缓存
            wx.setStorageSync(`chat_${this.data.sessionId}`, this.data.messages);

            // 滚动到底部
            this.scrollToBottom();

        } catch (error) {
            console.error('发送失败:', error);
            this.setData({ isLoading: false });
            wx.showToast({ title: '发送失败，请重试', icon: 'none' });
        }
    },

    /**
     * 滚动到底部
     */
    scrollToBottom: function () {
        wx.createSelectorQuery()
            .select('#message-list')
            .boundingClientRect((rect) => {
                if (rect) {
                    wx.pageScrollTo({
                        scrollTop: rect.height,
                        duration: 300
                    });
                }
            })
            .exec();
    },

    /**
     * 清空对话
     */
    clearChat: function () {
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有对话记录吗？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({ messages: [] });
                    wx.removeStorageSync(`chat_${this.data.sessionId}`);
                }
            }
        });
    }
});
