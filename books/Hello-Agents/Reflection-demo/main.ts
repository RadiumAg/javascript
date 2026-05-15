import dotEnv from 'dotenv';
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
    const finalAnswer = await this.executor.execute(question, plan);

    console.log(`\n--- 任务完成 ---\n最终答案: ${finalAnswer}")`);
  }
}

new PlanAndSolveAgent().run(
  '一个水果店周一卖出了15个苹果。周二卖出的苹果数量是周一的两倍。周三卖出的数量比周二少了5个。请问这三天总共卖出了多少个苹果？',
);
