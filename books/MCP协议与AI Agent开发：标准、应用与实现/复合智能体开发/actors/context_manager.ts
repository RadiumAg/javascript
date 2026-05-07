import { CHARACTER_CONFIGS, CharacterProfile } from './character_config';
import { generateResponse as callLLM } from '../engine/generator';

interface ContextMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class CharacterContextManager {
  private name: string;
  private profile: CharacterProfile;
  private history: string[] = [];

  constructor(characterName: string) {
    this.name = characterName;
    this.profile = CHARACTER_CONFIGS[characterName];
  }

  initializeContext(): void {
    this.history = [];
    const initialContext = [
      `角色背景：${this.profile.getBackground()}`,
      `性格：${this.profile.getPersonality()}`,
      `说话风格：${this.profile.getSpeakingStyle()}`,
      `当前情绪：${this.profile.getEmotion()}`,
    ].join('\n');
    this.history.push(initialContext);
  }

  buildPrompt(phase: string): string {
    const context = this.history.slice(-3).join('\n');
    return `
当前剧情阶段：${phase}
角色名称：${this.name}
角色背景：${this.profile.getBackground()}
性格特点：${this.profile.getPersonality()}
说话风格：${this.profile.getSpeakingStyle()}
当前情绪：${this.profile.getEmotion()}

上下文摘要：
${context}

请以${this.name}的身份，根据当前情境做出回应。`;
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await callLLM(prompt);
    return response;
  }

  updateContext(response: string): void {
    this.history.push(`${this.name}: ${response}`);
  }

  getHistory(): string[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

export { CharacterContextManager };
export type { ContextMessage };
