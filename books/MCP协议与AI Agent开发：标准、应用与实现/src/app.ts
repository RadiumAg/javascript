/**
 * MCP 邮件代理服务器
 * 从 Python FastMCP 翻译而来
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';

// 导入各类 MCP 工具
import { mailParser } from './tools/mail-parser';
import { classifier } from './tools/classifier';
import { summarizer } from './tools/summarizer';
import { replyGenerator } from './tools/reply-generator';
import { archiver } from './tools/archiver';

const registerAllTools = (app: McpServer) => {
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
      console.log('[DEBUG] summarizer input:', text);
      const result = await summarizer({ text });
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
