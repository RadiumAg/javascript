import dotEnv from 'dotenv';
import { callLLM } from './llm';
import { ChatCompletionMessageParam } from 'openai/resources/index';

dotEnv.config();

const AGENT_SYSTEM_PROMPT: ChatCompletionMessageParam = {
  role: 'system',
  content: `
你是一个智能旅行助手。你的任务是分析用户的请求，并使用可用工具一步步解决问题。
# 可用工具：
- 'getWeather(city:string)': 查询指定城市的实时天气。
- 'getAttraction(city:string, weather: string)': 根据城市和天气搜索推荐的旅游景点。

# 输出格式要求：
你的每次回复必须严格遵循一下格式，包括一对Thought和Action：

Thought: [你的思考过程和下一步计划]
Action: [你要执行的具体步骤]

Action的格式必须是一下之一：
1. 调用工具：functionName(arg_name="arg_value")
2. 结束任务：Finish[最终答案]

# 重要提示：
- 每次只输出一对Thought-Action
- Action 必须在同一行，不要换行
- 当收集到足够信息可以回答用户问题时，必须使用 Action：Finish[最终答案]格式结束

请开始吧！
`,
};

async function getWeather(city: string) {
  const url = `https://wtrr.in/${city}?format=j1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
    const currentCondition = response['current_condition'][0];
    const weatherDesc = currentCondition['weatherDesc'][0]['value'];
    const tempC = currentCondition['temp_C'];
    return `${city}当前天气：${weatherDesc}，气温${tempC}摄氏度`;

    return ``;
  } catch (e) {
    if (e instanceof Error) {
      return `错误：查询天气错误时遇到网络问题 - ${e.message}`;
    }

    if (e instanceof SyntaxError) {
      return `错误：解析天气数据失败，可能是城市名无效 - ${e.message}`;
    }
  }
}

async function getAttraction(city: string, weather: string): Promise<string> {
  // 1. 从环境变量中读取API密钥
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return '错误:未配置TAVILY_API_KEY环境变量。';
  }

  // 2. 构造一个精确的查询
  const query = `在${weather}天气下，${city}最值得去的旅游景点推荐及理由`;

  try {
    // 3. 调用Tavily API
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'basic',
        include_answer: true,
      }),
    });

    const data = await response.json();

    // 4. Tavily返回的结果已经非常干净，可以直接使用
    // data.answer 是一个基于所有搜索结果的总结性回答
    if (data.answer) {
      return data.answer;
    }

    // 如果没有综合性回答，则格式化原始结果
    const formattedResults: string[] = [];
    for (const result of data.results || []) {
      formattedResults.push(`- ${result.title}: ${result.content}`);
    }

    if (formattedResults.length === 0) {
      return '抱歉，没有找到相关的旅游景点推荐。';
    }

    return '根据搜索，为您找到以下信息:\n' + formattedResults.join('\n');
  } catch (e) {
    if (e instanceof Error) {
      return `错误:执行Tavily搜索时出现问题 - ${e.message}`;
    }
    return `错误:执行Tavily搜索时出现问题 - ${String(e)}`;
  }
}

// 将所有工具函数放入一个字典，方便后续调用
const availableTools = {
  getWeather,
  getAttraction,
};

async function run() {
  // 2.初始化
  const userPrompt =
    '你好，请帮我查询一下今天北京的天气，然后根据天气推荐一个合适的旅游景点';
  const promptHistory = [
    AGENT_SYSTEM_PROMPT,
    {
      role: 'user',
      content: userPrompt,
    } as ChatCompletionMessageParam,
  ];
  console.log(`用户请求：${userPrompt}`);

  // 3.运行主循环
  for (let i = 1; i <= 5; i++) {
    console.log(`循环${i + 1}`);

    // 3.2 调用LLM进行思考
    let llmOutput = await callLLM(promptHistory);

    const match = llmOutput?.match(
      /(Thought:[\s\S]*?\nAction:[\s\S]*?)(?=\n\s*(?:Thought:|Action:|Observation:)|$)/,
    );

    // 处理大模型返回的内容，只取需要的
    if (match) {
      const truncated = match[1].trim();
      if (truncated !== llmOutput?.trim()) {
        llmOutput = truncated;
      }
    }

    promptHistory.push({
      role: 'assistant',
      content: llmOutput,
    });

    const actionMatch = llmOutput?.match('Action:');
    if (actionMatch == null) {
      const observation = `错误: 未能解析到 Action 字段。请确保你的回复严格遵循 'Thought: ... Action: ...'的格式`;
      const observationStr = `Observation: ${observation}`;
      console.log(`${observationStr}\n`);
      promptHistory.push({ role: 'user', content: observationStr });
      continue;
    }

    const actionStr = llmOutput?.match(/Action:([\s\S]*)/)?.[1]?.trim() || '';
    if (actionStr.startsWith('Finish')) {
      const finalAnswer = actionStr.match(/Finish\[(.*)\]/)?.[1];
      console.log(`任务完成，最终答案：${finalAnswer}`);
      break;
    }

    const toolName = actionStr.match(/(\w+)\(/)?.[1];
    const argsStr = actionStr.match(/\((.*)\)/)?.[1] || '';
    const paramRegex = /(\w+)="([^"]*)"/g;
    let paramMatch = paramRegex.exec(argsStr);

    let observation = '';
    if (Reflect.has(availableTools, toolName)) {
      observation = availableTools[toolName](...paramMatch);
    } else {
      observation = `错误：为定义的工具${toolName}`;
    }

    // 记录观察结果
    const observationStr = `Observation: ${observation}`;
    console.log(`${observationStr}`);
    promptHistory.push({
      role: 'user',
      content: observationStr,
    });
  }
}

run();
