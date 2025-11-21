# Smart Teacher - 紧急修复指南

**时间**: 2025-11-21 14:14  
**状态**: 项目文件多次编辑导致损坏  
**建议**: 从零重建或使用备份

---

## 🚨 当前问题

1. **WXSS编译错误** - 样式文件损坏
2. **页面无法显示** - 多个文件损坏
3. **文件反复编辑** - 导致更多错误

---

## ✅ 解决方案

### 方案1：重新创建项目（推荐）

```bash
# 1. 备份当前database/schema.sql（这个文件是好的）
# 2. 新建微信小程序项目
# 3. 使用官方模板
# 4. 逐步添加功能
```

### 方案2：使用Git恢复

如果有Git版本控制：
```bash
git checkout -- miniprogram/pages/index/
```

### 方案3：手动清理

1. 删除`miniprogram/pages/index/`整个目录
2. 重新创建干净的文件

---

## 🔧 Token限制调整

### 位置
`miniprogram/utils/api.js` 第51行

### 修改
```javascript
// 当前
max_tokens: 2000

// 修改为（根据需要）
max_tokens: 4000  // 中等
max_tokens: 8000  // 较多
max_tokens: 16000 // 最多
```

### 注意事项
- Token越多 = 响应越慢
- Token越多 = 费用越高
- 建议测试时用2000-4000
- 生产环境根据需求调整

---

## 📝 最小化可运行版本

我已创建了两个文件：
- `pages/index/index_simple.wxml`
- `pages/index/index_simple.wxss`

### 使用方法

1. **删除损坏的文件**
```bash
删除 miniprogram/pages/index/index.wxml
删除 miniprogram/pages/index/index.wxss
```

2. **重命名简化文件**
```bash
index_simple.wxml  → index.wxml
index_simple.wxss  → index.wxss
```

3. **重新编译**

---

## 🎯 建议的下一步

### 选项A：继续修复当前项目
- 风险：可能还会遇到更多问题
- 时间：不确定

### 选项B：新建干净项目（强烈推荐）
- 好处：从零开始，无遗留问题
- 时间：30分钟
- 步骤：
  1. 新建微信小程序项目
  2. 复制这些文件：
     - `database/schema.sql`（数据库脚本）
     - `utils/api.js`（API封装）
     - `.env.example`（配置信息）
  3. 从简单页面开始逐步构建

---

## 📞 需要帮助？

如果选择方案B（推荐），我可以：
1. 为新项目创建完整的起始模板
2. 提供逐步构建指南
3. 确保每一步都能正常运行

---

**当前建议**：新建项目，避免继续在损坏的文件上工作。
