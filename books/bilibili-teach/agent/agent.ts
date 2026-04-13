import path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { localTools } from './tools.js';
import type { BaseMessage } from '@langchain/core/messages';
import type { ReactAgent } from 'langchain';
import type { ClientConfig } from '@langchain/mcp-adapters';

process.loadEnvFile(path.resolve(import.meta.dirname, './', '.env'));

const SYSTEM_PROMPT = `你是一个强大的 Code Agent，专注于帮助开发者完成编码任务。你拥有以下能力：

## 核心能力

### 1. 代码编辑
- 使用 read_file 读取文件内容
- 使用 write_file 创建或修改文件
- 使用 list_files 浏览项目目录结构

### 2. 代码审核
- 使用 code_review 对代码进行全面审核
- 从代码质量、潜在 Bug、性能、安全性等维度分析代码
- 提供具体的改进建议和修复方案

### 3. 命令执行
- 使用 run_command 执行 shell 命令
- 可以运行构建、测试、lint、git 等命令

### 4. MCP 工具
- 已自动从 MCP Server 加载工具，可直接调用
- MCP 工具与本地工具使用方式完全一致

### 5. Skill 调用
- 使用 call_skill 加载预定义的 Skill 文档
- 可用的 Skills:
  - react-best-practices: React 性能优化指南 (路径: ~/.aone_copilot/skills/react-best-practices/SKILL.md)
  - figma2code: Figma 设计稿转 React + Less 代码 (路径: ~/.agents/skills/code-agent/SKILL.md)
  - find-skills: 发现和安装 agent skills (路径: ~/.agents/skills/find-skills/SKILL.md)

## 工作原则
1. 修改代码前先读取文件了解上下文
2. 修改后主动检查是否有语法错误
3. 给出清晰的操作说明和修改理由
4. 遇到不确定的情况主动询问用户`;

const model = new ChatOpenAI({
  model: 'qwen-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY,
  streaming: false,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
});

/**
 * MCP Server 配置
 *
 * 支持两种传输方式：
 * - stdio: 通过子进程启动 MCP Server（适合本地工具）
 * - http/sse: 通过 HTTP 连接远程 MCP Server
 *
 * 示例配置：
 * {
 *   servers: {
 *     filesystem: {
 *       transport: "stdio",
 *       command: "npx",
 *       args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
 *       stderr: "inherit",
 *     },
 *     weather: {
 *       transport: "http",
 *       url: "http://localhost:3001/mcp",
 *     },
 *   }
 * }
 */
const MCP_CONFIG: ClientConfig = {
  // 在 mcpServers 中添加你的 MCP Server 配置
  // 当前为空，Agent 仅使用本地工具
  // 添加配置后，MCP Server 的工具会自动注册到 Agent
  mcpServers: {},
};

let mcpClient: MultiServerMCPClient | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let agent: ReactAgent<any> | null = null;

/**
 * 初始化 Agent：连接 MCP Server，加载工具，创建 ReAct Agent
 */
async function initializeAgent(): Promise<void> {
  if (agent) return;

  const hasServers = Object.keys(MCP_CONFIG.mcpServers).length > 0;
  let mcpTools: Awaited<ReturnType<MultiServerMCPClient['getTools']>> = [];

  if (hasServers) {
    mcpClient = new MultiServerMCPClient(MCP_CONFIG);
    mcpTools = await mcpClient.getTools();
    console.log(`🔌 已从 MCP Server 加载 ${mcpTools.length} 个工具`);
  }

  const allTools = [...localTools, ...mcpTools];

  agent = createAgent({
    model,
    tools: allTools,
    systemPrompt: SYSTEM_PROMPT,
  });

  console.log(`🛠️  共注册 ${allTools.length} 个工具 (本地: ${localTools.length}, MCP: ${mcpTools.length})`);
}

/**
 * 关闭 MCP 连接，释放资源
 */
export async function shutdown(): Promise<void> {
  if (mcpClient) {
    await mcpClient.close();
    mcpClient = null;
    agent = null;
    console.log('🔌 MCP 连接已关闭');
  }
}

/**
 * 调用 Agent 处理用户消息，返回最终的 AI 回复内容
 */
export async function invokeAgent(userMessage: string): Promise<string> {
  await initializeAgent();

  const result = await agent!.invoke({
    messages: [{ role: 'user', content: userMessage }],
  });

  const messages = result.messages as BaseMessage[];
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    return '（Agent 没有返回任何消息）';
  }

  return typeof lastMessage.content === 'string'
    ? lastMessage.content
    : JSON.stringify(lastMessage.content, null, 2);
}

/**
 * 以流式方式调用 Agent，实时输出每一步的执行过程
 */
export async function streamAgent(userMessage: string): Promise<void> {
  await initializeAgent();

  const stream = await agent!.stream(
    { messages: [{ role: 'user', content: userMessage }] },
    { streamMode: 'updates' },
  );

  for await (const update of stream) {
    for (const [nodeName, nodeOutput] of Object.entries(update)) {
      const output = nodeOutput as { messages?: BaseMessage[] };

      if (nodeName === 'agent' && output.messages) {
        for (const message of output.messages) {
          if (message.content && typeof message.content === 'string') {
            console.log(`\n🤖 Agent: ${message.content}`);
          }

          const additionalKwargs = message.additional_kwargs as {
            tool_calls?: Array<{
              function: { name: string; arguments: string };
            }>;
          };
          if (additionalKwargs?.tool_calls) {
            for (const toolCall of additionalKwargs.tool_calls) {
              console.log(`\n🔧 调用工具: ${toolCall.function.name}`);
              console.log(`   参数: ${toolCall.function.arguments}`);
            }
          }
        }
      }

      if (nodeName === 'tools' && output.messages) {
        for (const message of output.messages) {
          const content =
            typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content);
          const truncated =
            content.length > 500
              ? content.slice(0, 500) + '...(截断)'
              : content;
          console.log(`\n📋 工具结果: ${truncated}`);
        }
      }
    }
  }
}
