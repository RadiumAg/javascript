interface SystemPromptParams {
  name: string;
  personality: string;
  speaking_style: string;
  current_emotion: string;
  emotion_intensity: number;
}

interface ResponsePromptParams {
  name: string;
  plot_context: string;
  scene_description: string;
  other_characters: string;
}

class CharacterPromptTemplates {
  private static readonly CHARACTER_SYSTEM_PROMPT = `你是一位专业的角色扮演者，正在扮演名为{name}的角色。

【性格特点】
{personality}

【说话风格】
{speaking_style}

【当前情绪状态】
{current_emotion}（情绪强度：{emotion_intensity}）

请始终保持角色特征，用符合角色性格和说话风格的方式回应。
你的情绪状态会影响你的回应方式。`;

  private static readonly CHARACTER_RESPONSE_PROMPT = `当前剧情背景：
{plot_context}

当前场景描述：
{scene_description}

在场其他角色：
{other_characters}

请以{name}的身份，根据当前情境做出回应。
你的回应应该：
1. 符合你的性格特点和说话风格
2. 考虑当前的情绪状态
3. 与剧情发展和在场角色互动`;

  static formatSystemPrompt(params: SystemPromptParams): string {
    return CharacterPromptTemplates.CHARACTER_SYSTEM_PROMPT.replace(
      '{name}',
      params.name,
    )
      .replace('{personality}', params.personality)
      .replace('{speaking_style}', params.speaking_style)
      .replace('{current_emotion}', params.current_emotion)
      .replace('{emotion_intensity}', String(params.emotion_intensity));
  }

  static formatResponsePrompt(params: ResponsePromptParams): string {
    return CharacterPromptTemplates.CHARACTER_RESPONSE_PROMPT.replace(
      '{name}',
      params.name,
    )
      .replace('{plot_context}', params.plot_context)
      .replace('{scene_description}', params.scene_description)
      .replace('{other_characters}', params.other_characters);
  }
}

export { CharacterPromptTemplates };
export type { SystemPromptParams, ResponsePromptParams };
