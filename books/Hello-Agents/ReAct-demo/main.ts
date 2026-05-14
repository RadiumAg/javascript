import dotEnv from 'dotenv';
import { getAvailableTools, getTool, registerTool } from './tool-executor';
import { callLLM } from './llm';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { search } from './tools';

dotEnv.config();
const PLANNER_PROMPT_TEMPATE = `
你是一个顶级的AI规划专家。你的任务是将用户提出的复杂问题分解成一个由多个简单步骤组成的行动计划。
请确保计划中的每个步骤都是一个独立的、可执行的子任务，并且严格按照逻辑顺序排列。
你的输出必须是一个Python列表，其中每个元素都是一个描述子任务的字符串。

问题: {question}

请严格按照以下格式输出你的计划,\`\`\`python与\`\`\`作为前后缀是必要的:
\`\`\`python
["步骤1", "步骤2", "步骤3", ...]`;
