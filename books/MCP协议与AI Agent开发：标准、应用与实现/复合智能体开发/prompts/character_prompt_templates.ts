function buildCharacterPrompt(
  name: string,
  background: string,
  personality: string,
  style: string,
  emotion: string,
  storyPhase: string,
  history: string,
): string {
  return `【角色：${name}】
背景：${background}
性格：${personality}
语言风格：${style}
当前情绪：${emotion}
剧情阶段：${storyPhase}
上下文摘要：${history}
${name}：`;
}

export { buildCharacterPrompt };
