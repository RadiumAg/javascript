function shouldTriggerConflict(messages: string[]): boolean {
  const triggerWords = ['不信', '怀疑', '隐瞒', '骗', '意图', '威胁'];
  return messages.some((msg) => triggerWords.some((word) => msg.includes(word)));
}

function shouldTriggerUnderstanding(messages: string[]): boolean {
  const keyWords = ['理解', '原谅', '接受', '信任', '误会'];
  return messages.every((msg) => keyWords.some((word) => msg.includes(word)));
}

export { shouldTriggerConflict, shouldTriggerUnderstanding };
