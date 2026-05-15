import dotEnv from 'dotenv';
import { getAvailableTools, getTool, registerTool } from './tool-executor';
import { callLLM } from './llm';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { search } from './tools';

function format(this: String, ...args: any[]) {
  return this.replace(/\{.*\}/g, () => args.shift());
}

String.prototype.format = format;
dotEnv.config();

class PlanAndSolveAgent {
  private Plan:
  constructor {}
}
