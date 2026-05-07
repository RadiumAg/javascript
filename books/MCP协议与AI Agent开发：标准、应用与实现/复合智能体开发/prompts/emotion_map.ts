const EMOTION_LANGUAGE_MAPPING: Record<string, string[]> = {
  '快乐': ['温暖明快', '轻盈跳跃', '语气上扬', '使用感叹'],
  '悲伤': ['低沉缓慢', '语气下沉', '断句较多', '省略号'],
  '愤怒': ['短促有力', '锐利尖锐', '反问强调', '感叹连用'],
  '恐惧': ['迟疑畏缩', '断断续续', '试探性', '省略号'],
  '惊讶': ['跳跃断裂', '语气陡变', '重复强调', '感叹频繁'],
  '厌恶': ['冷淡疏离', '语气下沉', '简略回应', '反问'],
};

function emotionToneHint(emotion: string): string {
  const styles = EMOTION_LANGUAGE_MAPPING[emotion] ?? [];
  return styles.length > 0 ? styles.join('、') : '中性语气';
}

export { EMOTION_LANGUAGE_MAPPING, emotionToneHint };
