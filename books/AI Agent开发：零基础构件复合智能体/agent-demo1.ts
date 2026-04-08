import { v4 as uuidv4 } from 'uuid';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';

// ========== 状态定义 ==========
enum AgentState {
  INITIALIZED = 'initialized',
  READY = 'ready',
  RUNNING = 'running',
  WAITING_TOOL = 'waiting_tool',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// ========== 工具定义 ==========
class ForecastTool {
  name: string;
  description: string;

  constructor() {
    this.name = 'deepseek_forecast';
    this.description = '经济预测工具';
  }

  async call(query: string): Promise<string> {
    console.log('→ 调用 DeepSeek-V1 工具进行预测...');
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `【DeepSeek-V1】预测结果：${query} 的增长预期为5.2%`;
  }
}

// ========== 智能体任务结构 ==========
class StatefulAgent {
  taskId: string;
  state: AgentState;
  history: Array<{
    timestamp: number;
    taskId: string;
    state: string;
  }>;
  agent: ChatOpenAI;
  tool: ForecastTool;

  constructor(tools: ForecastTool[]) {
    this.taskId = uuidv4();
    this.state = AgentState.INITIALIZED;
    this.history = [];
    this.agent = new ChatOpenAI({
      model: 'qwen-turbo',
      temperature: 0.7,
      configuration: {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        apiKey: process.env.DASHSCOPE_API_KEY,
      },
    });
    this.tool = tools[0];
  }

  updateState(newState: AgentState): void {
    console.log(`→ 状态变更：${this.state} → ${newState}`);
    this.state = newState;
    this.history.push({
      timestamp: Date.now(),
      taskId: this.taskId,
      state: this.state,
    });
  }

  async execute(systemPrompt: string, userQuestion: string): Promise<string> {
    try {
      this.updateState(AgentState.READY);

      const fullPrompt = `【系统提示】
${systemPrompt}

【用户提问】
${userQuestion}

请结合相关经济数据工具完成结构化分析。`;

      this.updateState(AgentState.RUNNING);

      // 工具调用阶段
      this.updateState(AgentState.WAITING_TOOL);
      const toolResult = await this.tool.call(userQuestion);

      this.updateState(AgentState.RUNNING);

      // 构造模型最终输入
      const mergedPrompt = `${fullPrompt}
【工具响应】
${toolResult}
请生成回答：`;

      const response = await this.agent.invoke([
        new HumanMessage(mergedPrompt),
      ]);

      this.updateState(AgentState.COMPLETED);
      return response.content as string;
    } catch (error) {
      this.updateState(AgentState.FAILED);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return `[ERROR] 任务执行失败：${errorMessage}`;
    }
  }

  showHistory(): void {
    console.log('\n--- 状态变更日志 ---');
    for (const entry of this.history) {
      const date = new Date(entry.timestamp);
      const t = date.toISOString().replace('T', ' ').substring(0, 19);
      console.log(`${t} | 状态：${entry.state}`);
    }
  }
}

// ========== 主执行流程 ==========
async function main() {
  console.log('=== 启动具备状态管理的智能体系统 ===\n');

  const tool = new ForecastTool();
  const agent = new StatefulAgent([tool]);

  const systemPrompt =
    '你是一名宏观经济顾问，所有回答需结合当前CPI和GDP数据，表达严谨、简明。';
  const userQuestion = '请预测2024年GDP增长趋势，并说明主要影响因素。';

  const output = await agent.execute(systemPrompt, userQuestion);
  console.log('\n--- 模型响应输出 ---');
  console.log(output);

  agent.showHistory();
}

main().catch(console.error);
