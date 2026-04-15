/**
 * 邮件解析工具
 * 从 Python 翻译而来
 */

import type { MailContext } from '../context-type';

/**
 * 邮件解析器输入参数
 */
export interface MailParserInput {
  /** 原始邮件文本 */
  raw_text: string;
}

/**
 * 邮件解析工具
 * 伪解析逻辑，可拓展为正则提取或结构化邮件头解析
 *
 * @param input - 邮件解析器输入参数
 * @returns 解析后的邮件上下文
 */
export async function mailParser(input: MailParserInput): Promise<MailContext> {
  // 伪解析逻辑，可拓展为正则提取或结构化邮件头解析
  return {
    meta: {
      sender: 'user@example.com',
      receiver: 'bot@example.com',
      subject: '测试邮件',
      timestamp: new Date(),
    },
    body: {
      plain_text: input.raw_text,
    },
  };
}
