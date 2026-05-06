import { CharacterProfile, CHARACTER_CONFIGS } from './character_config';

interface ContextMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class CharacterContextManager {
  name: string;
  private profile: CharacterProfile;
  private contextHistory: ContextMessage[] = [];

  constructor(name: string) {
    this.name = name;
    const config = CHARACTER_CONFIGS[name];
    if (!config) {
      throw new Error(`角色配置未找到: ${name}`);
    }
    this.profile = config;
  }

  initializeContext(): void {
    const background = this.profile.getBackground();
    const personality = this.profile.getPersonality();
    const speakingStyle = this.profile.getSpeakingStyle();
    const emotion = this.profile.getEmotion();

    this.contextHistory = [];

    this.contextHistory.push({
      role: 'system',
      content: `你是${this.name}。${background}。你的性格是${personality}，说话风格是${speakingStyle}。你现在的情绪状态是${emotion}。`,
    });

    console.log(`【${this.name}】角色上下文已初始化`);
  }

  addToContext(role: 'user' | 'assistant', content: string): void {
    this.contextHistory.push({ role, content });
  }

  getContextHistory(): ContextMessage[] {
    return [...this.contextHistory];
  }

  generateResponse(prompt: string): string {
    this.contextHistory.push({ role: 'user', content: prompt });

    const response = `[${this.name}] 基于当前剧情发展和我的角色设定，我认为...`;

    this.contextHistory.push({ role: 'assistant', content: response });

    return response;
  }
}

export { CharacterContextManager };
