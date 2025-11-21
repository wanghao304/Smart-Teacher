// pages/chat/chat.js
const app = getApp();
const { chatAPI } = require('../../utils/api.js');

Page({
    data: {
        mentorId: '',
        projectId: '',
        mentor: null,
        project: null,

        // 聊天记录
        messages: [],

        // 输入
        inputText: '',
        inputMode: 'text', // text | voice

        // AI状态
        aiTyping: false,

        // 快捷问题
        quickQuestions: [
            '如何开始这个项目？',
            '遇到困难怎么办？',
            '有什么建议吗？',
            '如何提升效率？'
        ],
        showQuickQuestions: true,

        // 功能菜单
        showMenu: false,
        menuOptions: [
            { icon: '📎', label: '发送文件', action: 'sendFile' },
            { icon: '📷', label: '发送图片', action: 'sendImage' },
            { icon: '💾', label: '导出聊天', action: 'exportChat' },
            { icon: '🔄', label: '重新生成', action: 'regenerate' }
        ]
    },

    onLoad(options) {
        if (options.mentorId) {
            this.setData({
                mentorId: options.mentorId,
                projectId: options.projectId || ''
            });
            this.loadMentor();
            this.loadProject();
            this.loadChatHistory();
        }
        // 预设消息直接发送
        if (options.message) {
            this.setData({ inputText: decodeURIComponent(options.message) });
            setTimeout(() => this.sendMessage(), 500);
        }
    },

    loadMentor() {
        const mentors = wx.getStorageSync('userMentors') || [];
        const mentor = mentors.find(m => m.id === this.data.mentorId);
        if (mentor) {
            this.setData({ mentor });
            wx.setNavigationBarTitle({ title: `与${mentor.name}对话` });
        }
    },

    loadProject() {
        if (!this.data.projectId) return;
        const projects = wx.getStorageSync('userProjects') || [];
        const project = projects.find(p => p.id === this.data.projectId);
        if (project) this.setData({ project });
    },

    regenerateLastResponse() {
        if (this.data.messages.length < 2) return;
        const newMessages = this.data.messages.slice(0, -1);
        const lastUserMessage = newMessages[newMessages.length - 1];
        this.setData({
            messages: newMessages,
            aiTyping: true
        });
        this.getAIResponse(lastUserMessage.content);
    },

    onLongPress(e) {
        const index = e.currentTarget.dataset.index;
        const message = this.data.messages[index];
        wx.showActionSheet({
            itemList: ['复制', '删除'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    wx.setClipboardData({
                        data: message.content,
                        success: () => {
                            wx.showToast({ title: '已复制', icon: 'success' });
                        }
                    });
                } else if (res.tapIndex === 1) {
                    this.deleteMessage(index);
                }
            }
        });
    },

    loadChatHistory() {
        const chatKey = `chat_${this.data.mentorId}_${this.data.projectId || 'default'}`;
        const history = wx.getStorageSync(chatKey) || [];
        this.setData({ messages: history });
    },

    saveChatHistory() {
        const chatKey = `chat_${this.data.mentorId}_${this.data.projectId || 'default'}`;
        wx.setStorageSync(chatKey, this.data.messages);
    },

    sendMessage() {
        const text = this.data.inputText.trim();
        if (!text) {
            wx.showToast({ title: '请输入内容', icon: 'none' });
            return;
        }

        // 添加用户消息
        const userMsg = {
            role: 'user',
            content: text,
            time: new Date().toLocaleTimeString()
        };

        this.setData({
            messages: [...this.data.messages, userMsg],
            inputText: '',
            showQuickQuestions: false,
            aiTyping: true
        });

        // 保存聊天历史
        this.saveChatHistory();

        // 获取AI回复
        this.getAIResponse(text);
    },

    async getAIResponse(userMessage) {
        try {
            // 构建消息历史
            const messages = [
                ...this.data.messages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
                { role: 'user', content: userMessage }
            ];

            // 构建系统提示
            let systemPrompt = '';
            if (this.data.mentor) {
                systemPrompt = `你是${this.data.mentor.name}，${this.data.mentor.title || ''}。${this.data.mentor.desc || ''}。请以${this.data.mentor.name}的身份和风格回答用户的问题。`;
            }
            
            // 如果有项目信息，添加到系统提示
            if (this.data.project) {
                const projectContext = `当前项目：${this.data.project.name}。项目目标：${this.data.project.goal || ''}。`;
                if (systemPrompt) {
                    systemPrompt += '\n\n' + projectContext;
                } else {
                    systemPrompt = projectContext;
                }
            }

            // 如果有系统提示，添加到消息开头
            if (systemPrompt) {
                messages.unshift({ role: 'system', content: systemPrompt });
            }

            // 调用AI API
            const response = await chatAPI.send(messages);

            // 添加AI回复
            const aiMsg = {
                role: 'assistant',
                content: response.choices[0].message.content,
                time: new Date().toLocaleTimeString()
            };

            this.setData({
                messages: [...this.data.messages, aiMsg],
                aiTyping: false
            });

            // 保存聊天历史
            this.saveChatHistory();

        } catch (error) {
            console.error('AI回复失败:', error);
            this.setData({ aiTyping: false });
            
            // 添加错误消息
            const errorMsg = {
                role: 'assistant',
                content: '抱歉，我暂时无法回复。请稍后再试。',
                time: new Date().toLocaleTimeString(),
                error: true
            };

            this.setData({
                messages: [...this.data.messages, errorMsg]
            });

            wx.showToast({
                title: error.message || '发送失败，请重试',
                icon: 'none'
            });
        }
    },

    deleteMessage(index) {
        const msgs = [...this.data.messages];
        msgs.splice(index, 1);
        this.setData({ messages: msgs });
        this.saveChatHistory();
        wx.showToast({ title: '已删除', icon: 'success' });
    }
});
