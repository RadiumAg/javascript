import { CharacterPromptTemplates } from '../prompts/character_prompt_templates';

interface LLMClient {
  generate(prompt: string): string;
}

interface CharacterProfile {
  name: string;
  personality: string;
  speaking_style: string;
  current_emotion: string;
  emotion_intensity: number;
}

interface ContextMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class CharacterContextManager {
  private characterName: string;
  private characterProfile: CharacterProfile;
  private llm: LLMClient;
  private context: string = '';
  private history: ContextMessage[] = [];

  constructor(
    characterName: string,
    characterProfile: CharacterProfile,
    llm: LLMClient,
  ) {
    this.characterName = characterName;
    this.characterProfile = characterProfile;
    this.llm = llm;
  }

  get systemPrompt(): string {
    return CharacterPromptTemplates.formatSystemPrompt({
      name: this.characterName,
      personality: this.characterProfile.personality,
      speaking_style: this.characterProfile.speaking_style,
      current_emotion: this.characterProfile.current_emotion,
      emotion_intensity: this.characterProfile.emotion_intensity,
    });
  }

  generateResponse(context: string): string {
    this.context = context;
    const userPrompt = CharacterPromptTemplates.formatResponsePrompt({
      name: this.characterName,
      plot_context: context,
      scene_description: '',
      other_characters: '',
    });
    const fullPrompt = `${this.systemPrompt}\n\n${userPrompt}`;
    const response = this.llm.generate(fullPrompt);

    this.history.push({ role: 'user', content: context });
    this.history.push({ role: 'assistant', content: response });

    return response;
  }

  updateContext(newContext: string): void {
    this.context = newContext;
  }

  getHistory(): ContextMessage[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

export { CharacterContextManager };
export type { LLMClient, CharacterProfile, ContextMessage };
