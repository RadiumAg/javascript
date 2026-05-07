import { CharacterProfile } from '../actors/character_config';

interface Memory {
  content: string;
  summary: string;
}

interface LLMClient {
  generate(prompt: string): string;
}

interface EmotionResult {
  emotion: string;
  emotion_intensity: number;
}

function processMemories(memories: Memory[]): string {
  if (memories.length === 0) {
    return '';
  }
  return memories
    .map((memory, index) => `${index + 1}. ${memory.summary}`)
    .join('\n');
}

class EmotionUpdate {
  private llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  forward(
    name: string,
    profile: CharacterProfile,
    memories: Memory[],
    currentThoughts: string,
  ): EmotionResult {
    const memoryStr = processMemories(memories);

    const prompt = `
角色名称：${name}
性格特点：${profile.getPersonality()}
说话风格：${profile.getSpeakingStyle()}

回忆记忆：
${memoryStr}

当前思考：
${currentThoughts}

根据以上信息，分析${name}当前的情绪状态。
请以JSON格式返回，包含以下字段：
- emotion: 情绪状态（如：平静、愤怒、悲伤、快乐、焦虑、恐惧等）
- emotion_intensity: 情绪强度（0.0到1.0之间的浮点数）
`;

    const response = this.llm.generate(prompt);
    const result: EmotionResult = JSON.parse(response);
    return result;
  }
}

export { EmotionUpdate, processMemories };
export type { Memory, LLMClient, EmotionResult };
