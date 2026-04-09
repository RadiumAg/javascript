import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type TextContent,
} from "@modelcontextprotocol/sdk/types.js";

// 任务处理函数
async function processInput(
  messageText: string
): Promise<{ content: TextContent[] }> {
  // 获取用户输入内容（如邮件内容文本）
  const text = messageText.trim();

  // 通过路由器进行意图判断与任务分发
  const result = await routeMessage(text);

  return result;
}

// 消息路由函数（示例实现）
async function routeMessage(
  text: string
): Promise<{ content: TextContent[] }> {
  // 这里实现你的路由逻辑
  // 根据消息内容判断意图并分发到不同的处理器
  return {
    content: [
      {
        type: "text",
        text: `处理消息: ${text}`,
      },
    ],
  };
}

// 启动主入口函数
async function main(): Promise<void> {
  const server = new Server(
    {
      name: "mcp-router-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 注册工具列表处理器
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "process_message",
          description: "处理用户输入的消息并通过路由器进行任务分发",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "用户输入的消息文本",
              },
            },
            required: ["message"],
          },
        },
      ],
    };
  });

  // 注册工具调用处理器
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "process_message") {
      const message = String(request.params.arguments?.message || "");
      return await processInput(message);
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  });

  // 创建 stdio 传输层
  const transport = new StdioServerTransport();

  try {
    // 连接服务器和传输层
    await server.connect(transport);
    console.error("[系统已启动] 输入任意邮件内容开始处理，输入 quit 退出:");

    // 保持进程运行
    process.stdin.resume();
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
}

// 程序入口
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
