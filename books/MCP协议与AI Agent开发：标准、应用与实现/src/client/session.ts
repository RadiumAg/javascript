/**
 * MCP 客户端会话管理，这段是模拟cursor client的实现
 * 从 Python client/session.py 翻译而来
 * 用于创建和管理与 MCP 服务器的客户端会话
 */

import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio';
import {
  CreateMessageRequestParams,
  CreateMessageResult,
  TextContent,
} from '@modelcontextprotocol/sdk/types';

/**
 * FastMCP 服务端配置
 * 对应 Python 的 StdioServerParameters
 */
export const serverParams = {
  command: 'npx esno',
  args: ['../server/main.ts'],
};

/**
 * 默认回调函数 - 处理用户输入
 * 对应 Python 的 default_callback
 */
export async function defaultCallback(
  context: { session: Client },
  params: CreateMessageRequestParams,
): Promise<CreateMessageResult> {
  // 简单应答 - 回显用户输入
  const text = (params.messages[0].content as TextContent).text;

  return {
    role: 'assistant',
    content: {
      type: 'text',
      text: `收到: ${text}`,
    } as TextContent,
    model: 'echo-agent',
    stopReason: 'endTurn',
  };
}

/**
 * 回调函数类型定义
 */
export type SamplingCallback = (
  context: { session: Client },
  params: CreateMessageRequestParams,
) => Promise<CreateMessageResult>;

/**
 * 会话配置选项
 */
export interface SessionOptions {
  /** 采样回调函数 */
  callback?: SamplingCallback;
  /** 服务器参数 */
  serverParams?: {
    command: string;
    args: string[];
  };
}

/**
 * 创建客户端会话
 * 对应 Python 的 create_session 函数
 *
 * @param options - 会话配置选项
 * @returns MCP 客户端实例
 *
 * @example
 * ```typescript
 * import { createSession, defaultCallback } from './client/session';
 *
 * async function main() {
 *   // 使用默认配置
 *   const session1 = await createSession();
 *
 *   // 使用自定义回调
 *   const session2 = await createSession({
 *     callback: myCustomCallback
 *   });
 *
 *   // 完成后关闭会话
 *   await session1.close();
 *   await session2.close();
 * }
 * ```
 */
export async function createSession(
  options: SessionOptions = {},
): Promise<Client> {
  const { callback = defaultCallback, serverParams: params = serverParams } =
    options;

  // 创建 stdio 传输层
  const transport = new StdioClientTransport(params);

  // 创建客户端会话
  const session = new Client(
    {
      name: 'mcp-client',
      version: '1.0.0',
    },
    {
      capabilities: {
        sampling: {},
      },
    },
  );

  // 连接服务器
  await session.connect(transport);

  // 将回调函数附加到 session 对象上
  // 注意：在 TypeScript MCP SDK 中，回调函数通常在使用时直接调用
  // 而不是像 Python 那样注册到 session 上
  (session as any)._callback = callback;

  return session;
}

createSession().catch((error) => {
  console.error(error);
});
