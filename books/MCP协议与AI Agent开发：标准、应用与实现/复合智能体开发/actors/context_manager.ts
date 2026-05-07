import { CHARACTER_CONFIGS, CharacterProfile } from './character_config';
import { generateResponse as callLLM } from '../engine/generator';
import { buildCharacterPrompt } from '../prompts/character_prompt_templates';
import { emotionToneHint } from '../prompts/emotion_map';

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
    const toneHint = emotionToneHint(this.profile.getEmotion());
    const prompt = buildCharacterPrompt(
      this.name,
      this.profile.getBackground(),
      this.profile.getPersonality(),
      this.profile.getSpeakingStyle(),
      this.profile.getEmotion(),
      phase,
      context,
    );
    return `${prompt}\n语气风格提示：${toneHint}`;
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await callLLM(prompt);
    return response;
  }

  getProfile(): CharacterProfile {
    return this.profile;
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
