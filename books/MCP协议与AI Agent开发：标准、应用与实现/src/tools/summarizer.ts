/**
 * 邮件摘要器工具
 * 从 Python 翻译而来
 */

import type { SummaryResult } from '../context-type.js';

/**
 * 摘要器输入参数
 */
export interface SummarizerInput {
  /** 待摘要的文本内容 */
  text: string;
}

/**
 * 邮件摘要器
 * 简单截取前60个字符作为摘要，超过则添加省略号
 *
 * @param input - 摘要器输入参数
 * @returns 摘要结果
 */
export async function summarizer(
  input: SummarizerInput,
): Promise<SummaryResult> {
  const summary =
    input.text.length > 60
      ? input.text.substring(0, 60).trim() + '...'
      : input.text;

  return {
    summary,
  };
}
