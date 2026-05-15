import dotEnv from 'dotenv';
import { Memory } from './memory';
import { callLLM } from './llm';

function format(this: String, ...args: any[]) {
  return this.replace(/\{.*\}/g, () => args.shift());
}

String.prototype.format = format;
dotEnv.config();

const INITIAL_PROMPT_TEMPLATE = `
你是一位资深的Python程序员。请根据以下要求，编写一个Python函数。
你的代码必须包含完整的函数签名、文档字符串，并遵循PEP 8编码规范。

要求: {task}

请直接输出代码，不要包含任何额外的解释。
`;

const REFLECT_PROMPT_TEMPLATE = `
你是一位极其严格的代码评审专家和资深算法工程师，对代码的性能有极致的要求。
你的任务是审查以下Python代码，并专注于找出其在<strong>算法效率</strong>上的主要瓶颈。

# 原始任务:
{task}

# 待审查的代码:
\`\`\`python
{code}
\`\`\`

请分析该代码的时间复杂度，并思考是否存在一种<strong>算法上更优</strong>的解决方案来显著提升性能。
如果存在，请清晰地指出当前算法的不足，并提出具体的、可行的改进算法建议（例如，使用筛法替代试除法）。
如果代码在算法层面已经达到最优，才能回答“无需改进”。

请直接输出你的反馈，不要包含任何额外的解释。
`;

const REFINE_PROMPT_TEMPLATE = `
你是一位资深的Python程序员。你正在根据一位代码评审专家的反馈来优化你的代码。

# 原始任务:
{task}

# 你上一轮尝试的代码:
{last_code_attempt}
评审员的反馈：
{feedback}

请根据评审员的反馈，生成一个优化后的新版本代码。
你的代码必须包含完整的函数签名、文档字符串，并遵循PEP 8编码规范。
请直接输出优化后的代码，不要包含任何额外的解释。
`;

class ReflectionAgent {
  private memory = new Memory();
  private maxIterations = 5;

  async run(task: string) {
    console.log('\n--- 开始处理任务');

    // 1. 初始执行
    console.log('\n --- 正在进行初始尝试');
    const initialPrompt = INITIAL_PROMPT_TEMPLATE.format(task);
    const initialCode = await callLLM([
      { role: 'user', content: initialPrompt },
    ]);

    if (initialCode == null) return;

    this.memory.addRecord('execution', initialCode);

    for (let index = 0; index < this.maxIterations; index++) {
      console.log(`\n--- 第 ${index + 1}/${this.maxIterations} 轮迭代 ---`);

      // a. 反思
      console.log('\n -> 正在进行反思...');
      const lastCode = this.memory.getLastExecution();
      const reflectPrompt = REFLECT_PROMPT_TEMPLATE.format(task, lastCode);
      const feedback = await callLLM([
        { role: 'user', content: reflectPrompt },
      ]);
      if (feedback == null) {
        continue;
      }

      // b. 检查是否需要停止
      if (feedback.includes('无需改进')) {
        console.log('\n✅ 反思认为代码已无需改进，任务完成。');
        break;
      }
      this.memory.addRecord('reflection', feedback);

      // c. 优化
      const refinePrompt = REFINE_PROMPT_TEMPLATE.format(
        task,
        lastCode,
        feedback,
      );

      const refinedCode = await callLLM([
        { role: 'user', content: refinePrompt },
      ]);

      if (refinedCode == null) {
        continue;
      }

      this.memory.addRecord('execution', refinedCode);
    }

    const finalCode = this.memory.getLastExecution();
    console.log(
      `\n--- 任务完成 ---\n最终生成的代码:\n\`\`\`python\n${finalCode}\n\`\`\``,
    );
  }
}

new ReflectionAgent().run(
  '任务： 编写一个Python函数，找出1到n之间所有的素数 (prime numbers)。',
);
