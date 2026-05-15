import dotEnv from 'dotenv';
import { callLLM } from './llm';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { Planner } from './planner';
import { Executor } from './executor';

function format(this: String, ...args: any[]) {
  return this.replace(/\{.*\}/g, () => args.shift());
}

String.prototype.format = format;
dotEnv.config();

class PlanAndSolveAgent {
  private planner = new Planner();
  private executor = new Executor();
  constructor() {}

  /**
   *
   * 运行智能体的完整流程：线规划，后执行
   *
   */
  async run(question: string) {
    console.log(`\n--- 开始处理问题 ---\n问题: ${question}`);

    // 1. 调用规划起生成计划
    const plan = await this.planner.plan(question);

    // 检查技术啊是否生成成功
    if (plan == null) {
      console.log('\n--- 任务终止 --- \n无法生成有效的行动计划。');
      return;
    }

    // 2. 调用执行器执行计划
    const finalAnswer = this.executor.execute(question, plan);

    console.log(`\n--- 任务完成 ---\n最终答案: ${finalAnswer}")`);
  }
}

new PlanAndSolveAgent().run('');
