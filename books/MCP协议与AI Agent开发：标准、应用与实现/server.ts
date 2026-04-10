/**
 * WebSocket MCP 服务器
 * 从 Python FastAPI + WebSocket 翻译而来
 */

import { z } from 'zod';
import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import * as ws from 'ws';

type WebSocket = ws.WebSocket;
const WebSocketServer = ws.WebSocketServer;

// MCP 相关导入
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
// 定义一个 Mock 的大模型流式输出生成器，分批生成 Token
async function* tokenStreamGenerator(text: string): AsyncGenerator<string> {
  /**
   * 按顺序拆文本，每隔 0.3 秒拆分文本并发送一小段输出 Token，直到结束。
   */
  const chunkSize = 4;
  let index = 0;

  while (index < text.length) {
    const end = Math.min(index + chunkSize, text.length);
    yield text.substring(index, end);
    index = end;
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

// 定义一个工具，用于处理邮件正文并进行 Token 流式输出
interface StreamInput {
  text: string;
}

/**
 * 邮件流式处理工具
 * 简单的流式逻辑，将输入文本拆分并逐步返回 Token 流，
 * 每次输出一小片段字符串。
 */
async function mailStream(inputData: StreamInput): Promise<string> {
  const output: string[] = [];

  for await (const token of tokenStreamGenerator(inputData.text)) {
    output.push(token);
    // 最终返回完整文本
  }

  return output.join('');
}

/**
 * 创建 MCP 服务器实例
 */
const app = new Server(
  {
    name: 'mail-stream-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// 设置请求处理器
app.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'mail_stream',
        description: '处理邮件正文并进行 Token 流式输出',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: '待处理的邮件文本',
            },
          },
          required: ['text'],
        },
      },
    ],
  };
});

app.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'mail_stream') {
    const args = request.params.arguments as { text: string };
    const result = await mailStream({ text: args.text });
    
    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

/**
 * 启动 WebSocket 服务器
 */
async function main() {
  const PORT = 8080;

  // 创建 HTTP 服务器
  const httpServer = createServer();

  // 创建 WebSocket 服务器
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
    console.error('[WebSocket 连接] 新客户端已连接');
    console.error(`[客户端信息] ${request.socket.remoteAddress}`);

    // 创建自定义传输层
    const transport = {
      async start() {
        console.error('[传输层] 已启动');
      },
      
      async send(message: unknown) {
        const jsonMessage = JSON.stringify(message);
        console.error('[发送消息]', jsonMessage);
        ws.send(jsonMessage);
      },
      
      async close() {
        ws.close();
      },
      
      onmessage: null as ((message: unknown) => void) | null,
      onerror: null as ((error: Error) => void) | null,
      onclose: null as (() => void) | null,
    };

    // 处理 WebSocket 消息
    ws.on('message', async (data: Buffer) => {
      try {
        const message = data.toString();
        console.error('[收到消息]', message);
        
        const jsonMessage = JSON.parse(message);
        
        // 调用传输层的消息处理器
        if (transport.onmessage) {
          transport.onmessage(jsonMessage);
        }
      } catch (error) {
        console.error('[消息处理错误]', error);
        if (transport.onerror) {
          transport.onerror(error as Error);
        }
      }
    });

    ws.on('close', () => {
      console.error('[WebSocket 连接] 客户端已断开');
      if (transport.onclose) {
        transport.onclose();
      }
    });

    ws.on('error', (error: Error) => {
      console.error('[WebSocket 错误]', error);
      if (transport.onerror) {
        transport.onerror(error);
      }
    });

    // 连接 MCP 服务器和传输层
    try {
      await app.connect(transport as any);
      console.error('[MCP 服务器] 已连接到客户端');
    } catch (error) {
      console.error('[MCP 服务器连接错误]', error);
    }
  });

  // 启动 HTTP 服务器
  httpServer.listen(PORT, () => {
    console.error(`[邮件流式服务器已启动] 监听端口: ${PORT}`);
    console.error(`WebSocket 地址: ws://localhost:${PORT}`);
  });
}

// 程序入口
main();
