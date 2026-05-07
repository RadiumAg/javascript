function formatNarrativePrompt(characters: string, scene: string, mood: string): string {
  return `你是一位专业的故事叙述者。请根据以下信息生成一段精彩的故事内容。

出场角色：
${characters}

场景描述：${scene}

整体氛围：${mood}

请生成一段200-300字的故事叙述，要求：
1. 生动描绘场景和角色互动
2. 保持叙事连贯性
3. 融入角色性格特点`;
}

function formatContinuationPrompt(
  previousContent: string,
  plotThreads: string,
  characterStates: string,
): string {
  return `请根据以下故事上下文，继续推进剧情发展。

前情提要：
${previousContent}

未完结剧情线：
${plotThreads}

角色当前状态：
${characterStates}

请生成一段200-300字的续写，要求：
1. 自然承接前文
2. 推进至少一条剧情线
3. 保持角色行为一致性`;
}

function formatSceneTransitionPrompt(
  currentScene: string,
  nextScene: string,
  transitionReason: string,
): string {
  return `请生成一段场景转换内容。

当前场景：${currentScene}
目标场景：${nextScene}
转换原因：${transitionReason}

请生成一段100-200字的场景过渡，使场景切换自然流畅。`;
}

function formatPlotDevelopmentPrompt(
  currentPlot: string,
  tensionLevel: string,
  targetDirection: string,
): string {
  return `请根据当前剧情状态推进故事发展。

当前剧情：${currentPlot}
紧张度：${tensionLevel}
发展方向：${targetDirection}

请生成一段200-300字的剧情推进内容，要求：
1. 符合当前紧张度水平
2. 朝目标方向自然发展
3. 为后续剧情埋下伏笔`;
}

export {
  formatNarrativePrompt,
  formatContinuationPrompt,
  formatSceneTransitionPrompt,
  formatPlotDevelopmentPrompt,
};
