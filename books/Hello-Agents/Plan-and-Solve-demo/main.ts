import dotEnv from 'dotenv';
import { getAvailableTools, getTool, registerTool } from './tool-executor';
import { callLLM } from './llm';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { search } from './tools';

dotEnv.config();

registerTool('search', '搜索工具', search);

const REACT_PROMPT_TEMPLATE = `
请注意，你是一个有能力调用外部工具的智能助手。
可调用工具如下
{tools}

请严格按照一下格式进行回应：
Thought: 你的思考过程，用于分析问题、拆解任务和规划下一步行动
Action: 你决定采取的行动，必须是以下格式之一:
- tool_name[tool_input]:调用一个可用工具。
- Finish[最终答案]:当你认为已经获得最终答案时。
- 当你收集到足够的信息，能够回答用户的最终问题时，你必须在Action:字段后使用 Finish[最终答案] 来输出最终答案。

现在，请开始解决以下问题:
Question: {question}
History: {history}
`;

const history: string[] = [];
const maxAge = 5;

function format(str: string, ...args: any[]) {
  return str.replace(/\{.*\}/g, () => args.shift());
}

String.prototype.format = format;

/**
 *
 * 解析LLM的输出，提取Though和Action
 *
 * @param str
 */
const parseOutput = (str: string) => {
  // Thought:\s*：匹配 "Thought:" 后面跟零个或多个空白字符
  // (.*?)：非贪婪匹配任意字符（捕获组）
  //(?=\nAction:|$)：正向前瞻断言，匹配后面是 \nAction: 或字符串结尾的位置
  // /s：标志，让 . 匹配包括换行符的所有字符
  const thoughtMatch = str.match(/Thought:\s*(.*?)(?=\nAction:|$)/s);

  // Action: 匹配到文版末尾
  const actionMatch = str.match(/Action:\s*(.*)$/s);

  return {
    thought: thoughtMatch?.[1],
    action: actionMatch?.[1],
  };
};

/**
 *
 * 解析Action字符串，提取工具名称和输入
 *
 * @param actionText
 */
const parseAction = (actionText: string) => {
  const match = actionText.match(/(\w+)\[(.*)\]/s);
  if (match) {
    return { toolName: match[1], toolInput: match[2] };
  }
  return { toolName: null, toolInput: null };
};

async function run(question: string) {
  let currentStep = 0;

  while (currentStep < maxAge) {
    currentStep += 1;
    console.log(`第${currentStep}步`);

    const tools = getAvailableTools();

    const historyStr = history.join('\n');
    const prompt = REACT_PROMPT_TEMPLATE.format(
      REACT_PROMPT_TEMPLATE,
      tools,
      question,
      historyStr,
    );

    // 调用LLM进行思考
    const messages: ChatCompletionMessageParam[] = [
      { role: 'user', content: prompt },
    ];
    const responseText = await callLLM(messages);

    if (responseText == null) {
      console.log('错误：LLM未能返回有效响应');
      break;
    }

    const { thought, action } = parseOutput(responseText);

    if (thought) {
      console.log(`思考：${thought}`);
    }

    if (action == null) {
      console.log('警告:未能解析出有效的Action，流程终止。');
      break;
    }

    if (action.startsWith('Finish')) {
      // 如果是Finish指令，提取最终答案并结束
      const finalAnswer = action.match(/Finish\[(.*)\]/s);
      console.log(`🎉 最终答案: ${finalAnswer}`);
      return finalAnswer;
    }

    const { toolName, toolInput } = parseAction(action);
    if (toolName == null || toolInput == null) {
      continue;
    }

    console.log(`🎬 行动: ${toolName}[${toolInput}]`);

    const toolFunction = getTool(toolName);

    let observation = '';
    if (typeof toolFunction !== 'function') {
      observation = `错误：未找到名为${toolName}的工具`;
    } else {
      observation = await toolFunction(toolInput); // 调用工具
    }

    console.log(`👀 观察: ${observation}`);

    // 将本轮的Action和Observation添加到历史中
    history.push(`Action: ${action}`);
    history.push(`Observation:${observation}`);
  }

  // 循环结束
  console.log('已达到最大步数，流程终止。');
  return null;
}

run('搜一下特朗普访华谈论了啥');
