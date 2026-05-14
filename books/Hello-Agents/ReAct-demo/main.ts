import dotEnv from 'dotenv';
import { getAvailableTools } from './tool-executor';

dotEnv.config();

const tools = getAvailableTools();

const REACT_PROMPT_TEMPLATE = `
请注意，你是一个有能力调用外部工具的智能助手。
可调用工具如下
${tools}

请严格按照一下格式进行回应：
Thought: 你的思考过程，用于分析问题、拆解任务和规划下一步行动
- {{tool_name}}[{{tool_input}}]:调用一个可用工具。
- Finish[最终答案]:当你认为已经获得最终答案时。
- 当你收集到足够的信息，能够回答用户的最终问题时，你必须在Action:字段后使用 Finish[最终答案] 来输出最终答案。

现在，请开始解决以下问题:
Question: {question}
History: {history}
`;

function main() {}
