import 'dotenv/config'; // 自动加载 .env 文件中的环境变量
import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// 初始化通义千问大模型（使用 OpenAI 兼容接口）
// 文档: https://help.aliyun.com/zh/model-studio/
const llm = new ChatOpenAI({
  model: 'qwen-turbo', // 可选: qwen-turbo, qwen-plus, qwen-max, qwen-long 等
  temperature: 0.7, // 控制创造性 (0-1)
  configuration: {
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', // 通义千问 OpenAI 兼容接口
    apiKey: process.env.DASHSCOPE_API_KEY, // 通义千问 API 密钥
  },
});

// 使用 Annotation 定义状态（LangGraph 推荐方式）
const AgentStateAnnotation = Annotation.Root({
  query: Annotation<string>(),
  standardized: Annotation<string>(),
  retrieved: Annotation<string>(),
  summary: Annotation<string>(),
  conclusion: Annotation<string>(),
});

// 从 Annotation 推导类型
type AgentState = typeof AgentStateAnnotation.State;

// 定义第一个节点: 接收用户输入并标准化问题
function preprocessNode(state: AgentState): Partial<AgentState> {
  const query = state.query?.trim() || '';
  // 添加标准化逻辑
  const standardized = query.toLowerCase().replace('?', '');
  return { query, standardized };
}

// 定义第二个节点: 使用大模型检索文献并生成回答
async function retrieveNode(state: AgentState): Promise<Partial<AgentState>> {
  const query = state.standardized || '';

  // 使用大模型进行智能检索和回答
  const response = await llm.invoke([
    new SystemMessage(
      '你是一个专业的文献检索助手。根据用户的问题，提供准确、简洁的回答。',
    ),
    new HumanMessage(`请回答以下问题：${query}`),
  ]);

  return { retrieved: response.content as string };
}

// 定义第三个节点: 摘要生成
function summarizeNode(state: AgentState): Partial<AgentState> {
  const content = state.retrieved || '';
  let summary: string;

  if (content === '未找到相关文献') {
    summary = '暂无可用信息';
  } else {
    summary = content.substring(0, 20) + '...';
  }

  return { summary };
}

// 定义第四个节点: 结论生成
function concludeNode(state: AgentState): Partial<AgentState> {
  const summary = state.summary || '';
  let conclusion: string;

  if (summary === '暂无可用信息') {
    conclusion = '当前问题未能得到支持性资料';
  } else {
    conclusion = `基于文献摘要可得: ${summary}`;
  }

  return { conclusion };
}

// 构建任务图并使用链式调用添加节点和边
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode('preprocess', preprocessNode)
  .addNode('retrieve', retrieveNode)
  .addNode('summarize', summarizeNode)
  .addNode('conclude', concludeNode)
  .addEdge(START, 'preprocess')
  .addEdge('preprocess', 'retrieve')
  .addEdge('retrieve', 'summarize')
  .addEdge('summarize', 'conclude')
  .addEdge('conclude', END);

// 编译任务流
const graph = workflow.compile();

// 执行示例任务
async function main() {
  console.log('开始执行 AI Agent 任务...\n');

  const result = await graph.invoke({ query: 'LangGraph是什么？' });

  console.log('=== 执行结果 ===');
  console.log('原始问题:', result.query);
  console.log('标准化后:', result.standardized);
  console.log('AI 回答:', result.retrieved);
  console.log('摘要:', result.summary);
  console.log('结论:', result.conclusion);
}

main().catch(console.error);
