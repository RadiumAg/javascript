/**
 * 邮件分类器工具
 * 从 Python 翻译而来
 */

import type { ClassificationResult } from '../server/context-type.js';

/**
 * 分类器输入参数
 */
export interface ClassifierInput {
  /** 待分类的文本内容 */
  text: string;
}

/**
 * 邮件分类器
 * 基于关键词匹配进行简单分类
 *
 * @param input - 分类器输入参数
 * @returns 分类结果
 */
export async function classifier(
  input: ClassifierInput,
): Promise<ClassificationResult> {
  const content = input.text.toLowerCase();

  let category: string;

  if (content.includes('会议') || content.includes('汇报')) {
    category = '事务通知';
  } else if (content.includes('验证码') || content.includes('系统')) {
    category = '系统信息';
  } else if (content.includes('促销') || content.includes('优惠')) {
    category = '广告推广';
  } else {
    category = '社交沟通';
  }

  return {
    category,
    confidence: 0.9,
  };
}
