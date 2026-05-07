interface LLMClient {
  generate(prompt: string): string;
}

class ResponseCoordinator {
  private llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  coordinateResponses(
    storyContext: string,
    characterResponses: Record<string, string>,
  ): string {
    const prompt = this.buildCoordinatorPrompt(storyContext, characterResponses);
    return this.llm.generate(prompt);
  }

  private buildCoordinatorPrompt(
    storyContext: string,
    characterResponses: Record<string, string>,
  ): string {
    let prompt =
      '你是一位故事剧情协调专家。请协调以下多个角色的回应，确保它们之间逻辑连贯且富有戏剧性。\n\n';
    prompt += `当前剧情背景：\n${storyContext}\n\n`;
    prompt += '角色回应：\n';

    for (const [name, response] of Object.entries(characterResponses)) {
      prompt += `- ${name}：${response}\n`;
    }

    return prompt;
  }
}

export { ResponseCoordinator };
export type { LLMClient };
