import { StateGraph, END, START, Annotation } from '@langchain/langgraph';

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

// 定义第二个节点: 检索文献(这里用简单的数据库代替)
function retrieveNode(state: AgentState): Partial<AgentState> {
  const database: Record<string, string> = {
    langgraph: 'LangGraph是一种任务图编排框架,擅长复杂流程管理',
    agent: '智能体系统依赖任务调度与状态管理实现高效运行',
  };

  const keyword = state.standardized || '';
  const result = database[keyword] || '未找到相关文献';
  return { retrieved: result };
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
  const result = await graph.invoke({ query: 'LangGraph?' });
  console.log(result);
}

main().catch(console.error);
