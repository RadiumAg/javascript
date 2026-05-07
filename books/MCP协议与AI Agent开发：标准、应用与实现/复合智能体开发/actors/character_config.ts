class CharacterProfile {
  constructor(
    private name: string,
    private background: string,
    private personality: string,
    private speakingStyle: string,
    private emotion: string,
  ) {}

  getName(): string {
    return this.name;
  }

  getBackground(): string {
    return this.background;
  }

  getPersonality(): string {
    return this.personality;
  }

  getSpeakingStyle(): string {
    return this.speakingStyle;
  }

  getEmotion(): string {
    return this.emotion;
  }

  setEmotion(emotion: string): void {
    this.emotion = emotion;
  }
}

const CHARACTER_CONFIGS: Record<string, CharacterProfile> = {
  艾琳: new CharacterProfile(
    '艾琳',
    '银翼星舰的导航工程师，独立冷静，沉着果断',
    '善于分析，情绪不外露，遇事首先推理判断',
    '语言简洁明了，常用技术类词汇',
    '平静',
  ),
  诺亚: new CharacterProfile(
    '诺亚',
    '星舰安保主管，外表强硬但内心敏感',
    '偏执多疑，感情丰富，时常情绪化',
    '用词激烈，有时带讽刺语气',
    '戒备',
  ),
};

export { CharacterProfile, CHARACTER_CONFIGS };