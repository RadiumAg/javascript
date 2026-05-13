import dotEnv from 'dotenv';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';

dotEnv.config();

export const callLLM = async (messages: Array<ChatCompletionMessageParam>) => {
  const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    baseURL: process.env['OPENAI_BASE_URL'],
  });

  try {
    const response = await client.chat.completions.create({
      model: 'mimo-v2.5-pro',
      messages,
    });

    return response.choices[0].message.content;
    console.log('大模型响应成功');
  } catch (e) {
    if (e instanceof Error) {
      console.log(`调用LLM API时发生错误:${e.message}`);
    }

    return '错误，调用语言模型服务时出错';
  }
};
