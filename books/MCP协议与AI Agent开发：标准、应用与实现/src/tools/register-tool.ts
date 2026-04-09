/**
 * MCP 邮件代理服务器
 * 从 Python FastMCP 翻译而来
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';

// 导入各类 MCP 工具
import { mailParser } from './mail-parser';
import { classifier } from './classifier';
import { summarizer } from './summarizer';
import { replyGenerator } from './reply-generator';
import { archiver } from './archiver';
import { TextContent } from '@modelcontextprotocol/sdk/types';
import { Context, routeMessage } from '../server/router';

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

const registerAllTools = (app: McpServer) => {
  // 意图识别
  app.registerTool(
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

  // 注册工具：邮件解析器
  app.registerTool(
    'mail_parser',
    {
      description: '解析邮件内容，提取元数据和正文',
      inputSchema: z.object({
        raw_text: z.string().describe('原始邮件文本'),
      }),
    },
    async ({ raw_text }) => {
      const result = await mailParser({ raw_text });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // 注册工具：邮件分类器
  app.registerTool(
    'classifier',
    {
      description: '对邮件进行分类（事务通知、系统信息、广告推广、社交沟通）',
      inputSchema: z.object({
        text: z.string().describe('待分类的邮件文本'),
      }),
    },
    async ({ text }) => {
      const result = await classifier({ text });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // 注册工具：邮件摘要器
  app.registerTool(
    'summarizer',
    {
      description: '生成邮件摘要（前60个字符）',
      inputSchema: z.object({
        text: z.string().describe('待摘要的邮件文本'),
      }),
    },
    async ({ text }) => {
      const result = await summarizer({ text });
      console.error('summarizer 执行', text);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // 注册工具：回复生成器
  app.registerTool(
    'reply_generator',
    {
      description: '生成标准的确认回复',
      inputSchema: z.object({
        text: z.string().describe('待回复的邮件文本'),
      }),
    },
    async ({ text }) => {
      const result = await replyGenerator({ text });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // 注册工具：邮件归档器
  app.registerTool(
    'archiver',
    {
      description: '生成归档文件夹和标签建议',
      inputSchema: z.object({
        text: z.string().describe('待归档的邮件文本'),
      }),
    },
    async ({ text }) => {
      const result = await archiver({ text });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
};

export { registerAllTools };
