import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

interface ToolDescription {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ToolCall {
  name: string;
  arguments: string;
}

class SimpleReActAgent {
  private client: OpenAI;
  private tools: Record<string, Function>;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.apiKey,
      baseURL: process.env.baseURL,
      // 如果你想用其他兼容 OpenAI 的模型，可以修改 base URL
      // baseURL: 'https://api.deepseek.com/v1',
    });

    // 定义可用的工具
    this.tools = {
      get_weather: this.getWeather.bind(this),
      calculate: this.calculate.bind(this),
    };
  }

  private getWeather(city: string): string {
    // 模拟查询天气的工具
    // 实际应用中这里会调用真实的天气 API
    const weatherMap: Record<string, string> = {
      北京: '今天天气晴朗，气温 25°C。',
      上海: '今天多云转阴，气温 22°C。',
      广州: '今天雷阵雨，气温 28°C。',
      深圳: '今天晴天，气温 30°C。',
      杭州: '今天小雨，气温 20°C。',
    };
    return `${city}${weatherMap[city] || '的天气未知。'}`;
  }

  private calculate(expression: string): string {
    // 模拟计算器工具
    // 注意：生产环境不要直接用 eval，这里仅作演示
    try {
      // 简单的安全过滤，只允许数字、四则运算符和括号
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        return '计算错误：表达式包含非法字符。';
      }
      // eslint-disable-next-line no-eval
      const result = eval(expression);
      return String(result);
    } catch (error) {
      return '计算错误，请检查表达式格式。';
    }
  }

  private parseToolCall(content: string): ToolCall | null {
    // 使用正则表达式解析 XML 风格的标签
    const actionMatch = content.match(/<action>(.*?)<\/action>/i);
    const inputMatch = content.match(/<action_input>(.*?)<\/action_input>/i);

    if (actionMatch && inputMatch) {
      return {
        name: actionMatch[1].trim(),
        arguments: inputMatch[1].trim(),
      };
    }
    return null;
  }

  async run(userQuery: string): Promise<string> {
    const systemPrompt = `
你是一个智能助手，能够通过思考和使用工具来回答问题。

你可以使用的工具包括：
1. get_weather(city): 查询指定城市的天气。参数是城市名，例如 "北京"。
2. calculate(expression): 计算数学表达式。参数是算式，例如 "100 + 20"。

重要规则：
- 你无法直接知道天气、计算结果等事实性信息，必须通过调用工具来获取。
- 每一步只能调用一个工具。
- 只有通过工具获取了所有必要信息后，才能给出最终答案。

请按照以下格式进行交互：
<thought>在这里写下你的思考过程</thought>
<action>工具名称</action>
<action_input>工具参数</action_input>
<observation>这是由系统自动填入的实际工具调用结果</observation>

当你已经通过工具收集到足够信息，可以回答用户问题时，输出：
<final_answer>你的最终回答</final_answer>
`;

    let messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery },
    ];

    console.log(`👤 用户: ${userQuery}\n`);

    // 最多循环 5 次，防止死循环
    for (let i = 0; i < 5; i++) {
      try {
        const response = await this.client.chat.completions.create({
          model: 'mimo-v2.5-pro', // 或者 'gpt-4', 'deepseek-chat' 等
          messages: messages as any, // 类型适配
          temperature: 0,
        });

        const content = response.choices[0]?.message?.content || '';
        console.log(`🤖 AI输出: \n${content}\n---`);

        // 检查是否已完成
        if (content.includes('<final_answer>')) {
          const match = content.match(
            /<final_answer>([\s\S]*?)<\/final_answer>/i,
          );
          if (match) {
            return match[1].trim();
          }
          // 如果格式不完全匹配，尝试从文本中提取
          return (
            content
              .split('<final_answer>')[1]
              ?.split('</final_answer>')[0]
              ?.trim() || '无法解析最终答案'
          );
        }

        // 解析工具调用
        const toolCall = this.parseToolCall(content);
        if (toolCall) {
          const { name, arguments: args } = toolCall;

          // 检查工具是否存在
          if (this.tools[name]) {
            console.log(`🛠️ 执行工具: ${name}(${args})`);
            const result = this.tools[name](args);
            console.log(`🔍 工具结果: ${result}\n`);

            // 将 AI 的思考和工具的观察结果都加入对话历史
            messages.push({ role: 'assistant', content });
            messages.push({
              role: 'user',
              content: `<observation>${result}</observation>`,
            });
          } else {
            console.log(`⚠️ 未知工具: ${name}`);
            messages.push({
              role: 'user',
              content: `<observation>未知工具 "${name}"</observation>`,
            });
          }
        } else {
          // 如果没有找到工具调用，继续下一次循环或结束
          console.log('🤔 没有找到有效的工具调用，继续思考...');
          messages.push({ role: 'assistant', content });
        }
      } catch (error) {
        console.error('❌ 请求出错:', error);
        return '请求过程中发生错误。';
      }
    }

    return '达到最大循环次数，未能完成任务。';
  }
}

// --- 示例使用 ---
async function main() {
  // 替换为你的 API Key
  const agent = new SimpleReActAgent();

  // 测试查询
  const query = '帮我算一下 100 加上 25 等于多少，然后告诉我北京天气怎么样？';
  // const query = "上海今天的天气如何？";
  // const query = "计算 (50 * 2) + 10 的结果";

  try {
    const result = await agent.run(query);
    console.log(`✅ 最终结果: ${result}`);
  } catch (error) {
    console.error('❌ 运行出错:', error);
  }
}

main();

export default SimpleReActAgent;
