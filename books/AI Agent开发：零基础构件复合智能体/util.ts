import { ChatOpenAI } from '@langchain/openai';

const llm = new ChatOpenAI({
  model: 'qwen-turbo', // 可选: qwen-turbo, qwen-plus, qwen-max, qwen-long 等
  temperature: 0.7, // 控制创造性 (0-1)
  configuration: {
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', // 通义千问 OpenAI 兼容接口
    apiKey: process.env.DASHSCOPE_API_KEY, // 通义千问 API 密钥
  },
});

export { llm };
