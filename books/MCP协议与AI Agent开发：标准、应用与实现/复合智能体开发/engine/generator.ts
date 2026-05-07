import 'dotenv/config';
import OpenAI from 'openai';

interface CharacterInfo {
  name: string;
  background?: string;
  mood?: string;
}

class Generator {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.MIMO_API_KEY,
      baseURL: process.env.MIMO_BASE_URL,
    });
  }

  async generateStory(
    characters: CharacterInfo[],
    scene: string,
    plotContext: string,
  ): Promise<string> {
    const characterDescriptions = this.buildCharacterDescriptions(characters);

    const prompt = `
你是一位创意故事作家。

请根据以下信息生成下一段故事内容。

角色信息：
${characterDescriptions}

当前场景：${scene}

剧情背景：${plotContext}

请生成一段精彩的故事内容（200-300字）。
`;

    const response = await this.client.chat.completions.create({
      model: 'mimo-v2-pro',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content ?? '';
  }

  private buildCharacterDescriptions(characters: CharacterInfo[]): string {
    const descriptions: string[] = [];
    for (const char of characters) {
      const desc = `- ${char.name}：${char.background ?? '未知'}，当前情绪：${char.mood ?? '平静'}`;
      descriptions.push(desc);
    }
    return descriptions.join('\n');
  }
}

export { Generator };
export type { CharacterInfo };
