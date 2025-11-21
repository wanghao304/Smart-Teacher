// pages/profile-view/profile-view.js
const app = getApp();

Page({
    data: {
        profile: null,
        editingField: '',
        editingValue: '',

        motivationMap: {
            'career': '职业转型',
            'side': '副业创收',
            'interest': '纯粹兴趣',
            'solve': '解决具体问题'
        },
        comprehensionMap: {
            'visual': '视觉型',
            'auditory': '听觉型',
            'kinesthetic': '实践型'
        },
        methodMap: {
            'structured': '系统课程',
            'project': '项目驱动',
            'mentor': '一对一指导',
            'community': '社群共学'
        },
        commMap: {
            'direct': '直接型',
            'gentle': '温和型'
        },
        energyMap: {
            'solo': '独处充电',
            'social': '社交充电'
        },
        styleMap: {
            'strict': '严格督促',
            'supportive': '温和陪伴',
            'strategic': '战略指导'
        }
    },

    onLoad() {
        this.loadProfile();
    },

    onShow() {
        this.loadProfile();
    },

    loadProfile() {
        const profile = wx.getStorageSync('userProfile');

        if (profile && profile.currentIndustry) {
            const safeProfile = {
                currentIndustry: profile.currentIndustry || '',
                currentRole: profile.currentRole || '',
                yearsExp: profile.yearsExp || 0,
                learningType: profile.learningType || '',
                targetField: profile.targetField || '',
                targetProject: profile.targetProject || '',
                currentChallenge: profile.currentChallenge || '',
                learningMotivation: profile.learningMotivation || [],
                targetTimeline: profile.targetTimeline || 6,
                techSkills: profile.techSkills || [],
                softSkills: profile.softSkills || [],
                strengthArea: profile.strengthArea || '',
                weakArea: profile.weakArea || '',
                learningSpeed: profile.learningSpeed || 5,
                comprehensionStyle: profile.comprehensionStyle || '',
                preferredMethod: profile.preferredMethod || '',
                communicationStyle: profile.communicationStyle || '',
                stressResistance: profile.stressResistance || 5,
                energySource: profile.energySource || '',
                mentorStyle: profile.mentorStyle || '',
                mentorBackground: profile.mentorBackground || '',
                selfIntroduction: profile.selfIntroduction || profile.proudestAchievement || ''
            };
            this.setData({ profile: safeProfile });
        } else {
            this.setData({ profile: null });
        }
    },

    startEdit(e) {
        const field = e.currentTarget.dataset.field;
        const currentValue = this.data.profile[field];

        let displayValue = '';
        if (Array.isArray(currentValue)) {
            displayValue = currentValue.join(', ');
        } else {
            displayValue = currentValue ? currentValue.toString() : '';
        }

        this.setData({
            editingField: field,
            editingValue: displayValue
        });
    },

    onInputChange(e) {
        this.setData({ editingValue: e.detail.value });
    },

    saveEdit() {
        const { editingField, editingValue, profile } = this.data;

        if (!editingValue) {
            return wx.showToast({ title: '内容不能为空', icon: 'none' });
        }

        if (['techSkills', 'softSkills', 'learningMotivation'].includes(editingField)) {
            profile[editingField] = editingValue.split(/[,，、]/).map(s => s.trim()).filter(s => s);
        } else {
            profile[editingField] = editingValue;
        }

        wx.setStorageSync('userProfile', profile);

        this.setData({
            profile,
            editingField: '',
            editingValue: ''
        });

        wx.showToast({ title: '保存成功', icon: 'success' });
    },

    cancelEdit() {
        this.setData({
            editingField: '',
            editingValue: ''
        });
    },

    reCollect() {
        wx.navigateTo({ url: '/pages/profile/profile' });
    }
});
