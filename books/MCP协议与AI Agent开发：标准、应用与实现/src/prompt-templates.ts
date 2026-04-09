/**
 * Prompt 模板定义
 * 从 Python 翻译而来
 */

// 模板：摘要生成
export const SUMMARY_PROMPT_TEMPLATE = `
请对以下邮件内容生成一段简明了的中文摘要，控制在100字以内：

---
{content}
---

摘要：
`;

// 模板：分类任务
export const CLASSIFY_PROMPT_TEMPLATE = `
以下是一封电子邮件，请判断其属于哪一类（事务、广告、系统通知、社交）：

---
{content}
---

邮件类别：
`;

// 模板：邮件回复构造
export const REPLY_PROMPT_TEMPLATE = `
请基于以下邮件内容，构造一条合适的回复语句，请气需保持正式和礼貌：

---
{content}
---

建议回复：
`;

// 模板：归档与标签标注
export const ARCHIVE_PROMPT_TEMPLATE = `
请根据以下邮件内容，建议一个合适的归档文件夹与标签集合，用于邮件分类与后续检索：

---
{content}
---

建议归档路径与标签：
`;

/**
 * 格式化 prompt 模板
 * @param template - 模板字符串
 * @param variables - 变量对象
 * @returns 格式化后的字符串
 */
export function formatPrompt(
  template: string,
  variables: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}
