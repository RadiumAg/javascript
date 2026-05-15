import { ChatCompletionMessageParam } from 'openai/resources/index';
import { callLLM } from './llm';

const EXECUTOR_PROMPT_TEMPLATE = `
你是一位顶级的AI执行专家。你的任务是严格按照给定的计划，一步步地解决问题。
你将收到原始问题、完整的计划、以及到目前为止已经完成的步骤和结果。
请你专注于解决“当前步骤”，并仅输出该步骤的最终答案，不要输出任何额外的解释或对话。

# 原始问题:
{question}

# 完整计划:
{plan}

# 历史步骤与结果:
{history}

# 当前步骤:
{current_step}

请仅输出针对“当前步骤”的回答:
`;

class Executor {
  /**
   *
   * 根据计划逐步执行并解决问题
   *
   * @param question
   * @param plan
   */
  async execute(question: string[], plan: any[]) {
    let history = ``; // 用于存储历史步骤和结果的字符串;

    console.log('\n --- 正在执行计划 ---');

    let responseText: string | null = '';
    for (let index = 0; index < plan.length; index++) {
      const step = plan[index];
      console.log(`\n 正在执行步骤 ${index + 1} / ${plan.length}: ${step}`);

      const prompt = EXECUTOR_PROMPT_TEMPLATE.format(
        question,
        plan,
        history,
        step,
      );

      const messages: ChatCompletionMessageParam[] = [
        { role: 'user', content: prompt },
      ];

      responseText = await callLLM(messages);

      // 更新记录，为下一步做准备
      history += `步骤${index + 1}：${step}\n结果：${responseText}\n\n`;

      console.log(`✅ 步骤 ${index + 1} 已完成，结果: ${responseText}`);
    }

    // 循环结束后，最后一步的响应就是最终答案
    const finalAnswer = responseText;
    return finalAnswer;
  }
}

export { Executor };
