import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { routeMessage } from './router';
import { z } from 'zod';

// 定义 TextContent 类型
interface TextContent {
  type: 'text';
  text: string;
}

// 定义 Context 类型（与 router.ts 保持一致）
interface Context {
  session: {
    call_tool: (params: { tool_name: string; tool_input: any }) => Promise<{
      content: Array<{ text: string }>;
    }>;
  };
}

// 创建一个模拟的 context 对象
const createContext = (): Context => {
  return {
    session: {
      call_tool: async (params) => {
        // 这里应该实现实际的工具调用逻辑
        // 目前返回一个模拟响应
        return {
          content: [
            {
              text: `工具 ${params.tool_name} 处理结果: ${JSON.stringify(params.tool_input)}`,
            },
          ],
        };
      },
    },
  };
};

// 任务处理函数
async function processInput(
  messageText: string,
): Promise<{ content: TextContent[] }> {
  // 获取用户输入内容（如邮件内容文本）
  const text = messageText.trim();

  // 创建 context
  const context = createContext();

  // 通过路由器进行意图判断与任务分发
  const result = await routeMessage(context, text);

  return {
    content: [result.content],
  };
}

// 启动主入口函数
async function main(): Promise<void> {
  const server = new McpServer(
    {
      name: 'mcp-router-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // 注册工具
  server.registerTool(
    'process_message',
    {
      description: '处理用户输入的消息并通过路由器进行任务分发',
      inputSchema: z.object({
        message: z.string().describe('用户输入的消息文本'),
      }),
    },
    async ({ message }) => {
      const result = await processInput(message);
      return {
        content: result.content,
      };
    },
  );

  // 创建 stdio 传输层
  const transport = new StdioServerTransport();

  try {
    // 连接服务器和传输层
    await server.connect(transport);
    console.error('[系统已启动] 输入任意邮件内容开始处理，输入 quit 退出:');

    // 保持进程运行
    process.stdin.resume();
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
}

// 程序入口
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
