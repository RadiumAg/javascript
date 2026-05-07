class EmotionMap {
  private static readonly emotionValence: Record<string, number> = {
    '快乐': 0.8,
    '悲伤': -0.6,
    '愤怒': -0.7,
    '恐惧': -0.8,
    '惊讶': 0.2,
    '厌恶': -0.5,
    '期待': 0.4,
    '信任': 0.6,
    '焦虑': -0.3,
    '平静': 0.1,
    '戒备': -0.2,
  };

  private static readonly emotionArousal: Record<string, number> = {
    '快乐': 0.7,
    '悲伤': 0.4,
    '愤怒': 0.9,
    '恐惧': 0.8,
    '惊讶': 0.8,
    '厌恶': 0.5,
    '期待': 0.6,
    '信任': 0.3,
    '焦虑': 0.7,
    '平静': 0.2,
    '戒备': 0.6,
  };

  static getValence(emotion: string): number {
    return EmotionMap.emotionValence[emotion] ?? 0.0;
  }

  static getArousal(emotion: string): number {
    return EmotionMap.emotionArousal[emotion] ?? 0.5;
  }

  static classifyEmotion(valence: number, arousal: number): string {
    if (valence >= 0.3 && arousal >= 0.5) return '快乐';
    if (valence <= -0.3 && arousal >= 0.5) return '愤怒';
    if (valence <= -0.3 && arousal <= 0.4) return '悲伤';
    if (valence <= -0.4 && arousal >= 0.6) return '恐惧';
    if (valence >= 0.0 && arousal >= 0.5) return '焦虑';
    return '平静';
  }
}

export { EmotionMap };
