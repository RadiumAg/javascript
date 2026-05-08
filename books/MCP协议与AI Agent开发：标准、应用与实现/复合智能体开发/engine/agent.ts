import { generateResponse as callLLM } from './generator';

interface Tool {
  name: string;
  description: string;
  parameters: Record<string, string>;
  execute: (params: Record<string, string>) => Promise<string>;
}

interface AgentDecision {
  thought: string;
  action: string;
  params: Record<string, string>;
}

function parseXMLDecision(text: string): AgentDecision {
  const stripFences = text
    .replace(/```(?:xml)?\s*\n?/g, '')
    .replace(/```/g, '');

  const thoughtMatch = stripFences.match(/<thought>([\s\S]*?)<\/thought>/);
  const actionMatch = stripFences.match(/<action>([\s\S]*?)<\/action>/);

  const thought = thoughtMatch ? thoughtMatch[1].trim() : '';
  const actionStr = actionMatch ? actionMatch[1].trim() : '';

  // 解析 "toolname(key1="val1", key2="val2")" 或 "toolname()"
  const nameMatch = actionStr.match(/^(\w+)/);
  const action = nameMatch ? nameMatch[1] : actionStr;

  const params: Record<string, string> = {};
  const argsMatch = actionStr.match(/\(([\s\S]*)\)/);
  if (argsMatch && argsMatch[1].trim()) {
    const argPairs = argsMatch[1].matchAll(/(\w+)\s*=\s*"([^"]*)"/g);
    for (const pair of argPairs) {
      params[pair[1]] = pair[2];
    }
  }

  return { thought, action, params };
}

class StoryAgent {
  private tools: Tool[] = [];
  private maxSteps: number = 20;

  registerTool(tool: Tool): void {
    this.tools.push(tool);
  }

  private buildDecisionPrompt(state: string): string {
    const toolList = this.tools
      .map((t) => {
        const paramsStr = Object.entries(t.parameters)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        const sig = paramsStr
          ? `  ${t.name}(${paramsStr})`
          : `  ${t.name}()`;
        return `${sig}\n    ${t.description}`;
      })
      .join('\n\n');

    return `你是一个故事叙事AI导演Agent，负责自主控制剧情发展。你拥有以下工具：

${toolList}

当前系统状态：
${state}

请根据当前状态推理并决定下一步行动。用以下XML格式输出：

<thought>你的推理过程：为什么选择这个行动，期望达到什么效果</thought>
<action>工具名(参数名="参数值")</action>

示例：
<thought>相遇阶段刚开始，艾琳还没有发言，应该先让她说话</thought>
<action>character_speak(character="艾琳")</action>

关键规则：
- 每个剧情阶段先让所有角色依次发言，再更新情绪、检测触发、协调推进
- 「协调」后判断是否应该推进阶段或结束
- 当剧情充分发展后使用 finish(summary="结局概述") 结束
- 每次只输出一组 thought 和 action
- 无参数的工具写为 toolname()，如 update_emotions()`;
  }

  private async decide(state: string): Promise<AgentDecision> {
    const prompt = this.buildDecisionPrompt(state);
    const response = await callLLM(prompt);
    return parseXMLDecision(response);
  }

  async run(getState: () => string): Promise<void> {
    let steps = 0;

    console.log('【Agent】启动自主决策循环\n');

    while (steps < this.maxSteps) {
      const state = getState();
      const decision = await this.decide(state);

      console.log(`\n--- 第 ${steps + 1} 步 ---`);
      console.log(`🧠 思考: ${decision.thought}`);
      console.log(`🔧 行动: ${decision.action}(${JSON.stringify(decision.params)})`);

      if (decision.action === 'finish') {
        console.log(`\n📖 结局: ${decision.params.summary || '故事结束'}`);
        break;
      }

      const tool = this.tools.find((t) => t.name === decision.action);
      if (!tool) {
        console.log(`⚠️ 未知工具: ${decision.action}，Agent 将尝试其他行动`);
        steps++;
        continue;
      }

      try {
        const result = await tool.execute(decision.params);
        console.log(`✅ 结果: ${result}`);
      } catch (e) {
        console.log(`❌ 执行失败: ${e}`);
      }

      steps++;
    }

    if (steps >= this.maxSteps) {
      console.log('\n⚠️ 达到最大步数限制，强制结束');
    }

    console.log('\n【Agent】决策循环结束');
  }
}

export { StoryAgent };
export type { Tool, AgentDecision };
