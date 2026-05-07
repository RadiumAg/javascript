interface LLMClient {
  generate(prompt: string): string;
}

interface CharacterInfo {
  name: string;
  background?: string;
  mood?: string;
  [key: string]: unknown;
}

class Generator {
  private llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  generateStory(
    characters: CharacterInfo[],
    scene: string,
    plotContext: string,
  ): string {
    const characterDescriptions = this.buildCharacterDescriptions(characters);

    const prompt = `
你是一位创意故事作家。请根据以下信息生成下一段故事内容。

角色信息：
${characterDescriptions}

当前场景：${scene}

剧情背景：${plotContext}

请生成一段精彩的故事内容（200-300字）。
`;

    return this.llm.generate(prompt);
  }

  private buildCharacterDescriptions(characters: CharacterInfo[]): string {
    return characters
      .map(
        (char) =>
          `- ${char.name}：${char.background ?? '未知'}，当前情绪：${char.mood ?? '平静'}`,
      )
      .join('\n');
  }
}

export { Generator };
export type { LLMClient, CharacterInfo };
