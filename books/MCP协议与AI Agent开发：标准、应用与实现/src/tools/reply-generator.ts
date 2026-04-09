/**
 * 邮件回复生成器工具
 * 从 Python 翻译而来
 */

import type { ReplyCandidate } from '../server/context-type.js';

/**
 * 回复生成器输入参数
 */
export interface ReplyInput {
  /** 待回复的文本内容 */
  text: string;
}

/**
 * 邮件回复生成器
 * 生成标准的确认回复
 *
 * @param input - 回复生成器输入参数
 * @returns 回复建议
 */
export async function replyGenerator(
  input: ReplyInput,
): Promise<ReplyCandidate> {
  const reply = '您好，邮件已收到，将尽快处理，感谢联系。';

  return {
    reply_text: reply,
    intent: '确认',
  };
}
