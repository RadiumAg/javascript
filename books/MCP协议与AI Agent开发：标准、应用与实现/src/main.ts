import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { registerAllTools } from './tools/register-tool';

// 启动主入口函数
async function main(): Promise<void> {
  const server = new McpServer(
    {
      name: 'mail-agent',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // 注册工具
  registerAllTools(server);

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
