// config/api.js
module.exports = {
    // Doubao (豆包) AI 接口
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    // 授权 Token（已全权授权）
    apiKey: "361fc5ee-74d8-45cf-bc70-3685385fddf3",
    // 使用的模型
    model: "doubao-seed-1-6-251015",
    // 最大返回 token 数（可根据需求调整）
    maxCompletionTokens: 65535,
    // 推理力度（medium / high / low）
    reasoningEffort: "medium",
    timeout: 15000
};
