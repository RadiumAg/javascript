/**
 * MCP 调试检查器
 * 从 Python debug/inspector.py 翻译而来
 * 用于测试 MCP 工具调用和会话交互
 */

import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio';
import {
  CreateMessageRequestParams,
  CreateMessageResult,
  TextContent,
} from '@modelcontextprotocol/sdk/types';
import logger from '../debugger/logger.js';

// 调试回调函数类型
type DebugCallback = (
  context: { session: Client },
  params: CreateMessageRequestParams
) => Promise<CreateMessageResult>;

/**
 * 调试回调函数
 * 拦截消息并手动指定任务意图进行测试
 */
async function debugCallback(
  context: { session: Client },
  params: CreateMessageRequestParams
): Promise<CreateMessageResult> {
  const text = (params.messages[0].content as TextContent).text.trim();
  logger.info(`[输入内容] ${text}`);

  // 手动指定任务意图进行测试 (默认使用summarizer)
  try {
    const response = await context.session.callTool({
      name: 'summarizer',
      arguments: { text: text },
    });

    const responseText =
      (response.content[0] as TextContent).text || '无返回内容';
    logger.info(`[调用成功] tool=summarizer → ${responseText}`);

    return {
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: responseText,
        } as TextContent,
      ],
      model: 'debug-agent',
      stopReason: 'endTurn',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`[调用失败] ${errorMsg}`);

    return {
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: '处理失败,请检查日志',
        } as TextContent,
      ],
      model: 'debug-agent',
      stopReason: 'error',
    };
  }
}

/**
 * 启动调试会话
 */
async function debugMain() {
  // 创建 stdio 传输
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/server/main.js'],
  });

  // 创建客户端会话
  const session = new Client(
    {
      name: 'debug-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // 连接并初始化
    await session.connect(transport);
    await session.initialize();

    console.log(
      '[调试模式] 输入任意内容触发 summarizer 工具调用,输入 quit 退出'
    );

    // 交互式循环
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = (query: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(query, (answer) => {
          resolve(answer);
        });
      });
    };

    while (true) {
      const userInput = (await askQuestion('邮件内容> ')).trim();

      if (userInput.toLowerCase() === 'quit') {
        break;
      }

      // 创建消息参数
      const messageParams: CreateMessageRequestParams = {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: userInput,
            },
          },
        ],
      };

      // 调用调试回调
      const result = await debugCallback({ session }, messageParams);

      // 输出结果
      if (result.content[0].type === 'text') {
        console.log((result.content[0] as TextContent).text);
      }
    }

    rl.close();
  } finally {
    await session.close();
  }
}

// 主入口
if (import.meta.url === `file://${process.argv[1]}`) {
  debugMain().catch((error) => {
    logger.error(`调试器启动失败: ${error}`);
    process.exit(1);
  });
}

export { debugCallback, debugMain };
