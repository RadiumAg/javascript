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
}
