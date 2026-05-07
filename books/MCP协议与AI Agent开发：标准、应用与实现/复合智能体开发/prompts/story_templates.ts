interface NarrativePromptParams {
  characters: string;
  scene: string;
  mood: string;
}

interface ContinuationPromptParams {
  previous_content: string;
  plot_threads: string;
  character_states: string;
}

interface SceneTransitionParams {
  current_scene: string;
  next_scene: string;
  transition_reason: string;
}

interface PlotDevelopmentParams {
  current_plot: string;
  tension_level: string;
  target_direction: string;
}

class StoryTemplates {
  private static readonly STORY_NARRATIVE_PROMPT = `你是一位专业的故事叙述者。请根据以下信息生成一段精彩的故事内容。

出场角色：
{characters}

场景描述：{scene}

整体氛围：{mood}

请生成一段200-300字的故事叙述，要求：
1. 生动描绘场景和角色互动
2. 保持叙事连贯性
3. 融入角色性格特点`;

  private static readonly STORY_CONTINUATION_PROMPT = `请根据以下故事上下文，继续推进剧情发展。

前情提要：
{previous_content}

未完结剧情线：
{plot_threads}

角色当前状态：
{character_states}

请生成一段200-300字的续写，要求：
1. 自然承接前文
2. 推进至少一条剧情线
3. 保持角色行为一致性`;

  private static readonly SCENE_TRANSITION_PROMPT = `请生成一段场景转换内容。

当前场景：{current_scene}
目标场景：{next_scene}
转换原因：{transition_reason}

请生成一段100-200字的场景过渡，使场景切换自然流畅。`;

  private static readonly PLOT_DEVELOPMENT_PROMPT = `请根据当前剧情状态推进故事发展。

当前剧情：{current_plot}
紧张度：{tension_level}
发展方向：{target_direction}

请生成一段200-300字的剧情推进内容，要求：
1. 符合当前紧张度水平
2. 朝目标方向自然发展
3. 为后续剧情埋下伏笔`;

  static formatNarrativePrompt(params: NarrativePromptParams): string {
    return StoryTemplates.STORY_NARRATIVE_PROMPT.replace(
      '{characters}',
      params.characters,
    )
      .replace('{scene}', params.scene)
      .replace('{mood}', params.mood);
  }

  static formatContinuationPrompt(params: ContinuationPromptParams): string {
    return StoryTemplates.STORY_CONTINUATION_PROMPT.replace(
      '{previous_content}',
      params.previous_content,
    )
      .replace('{plot_threads}', params.plot_threads)
      .replace('{character_states}', params.character_states);
  }

  static formatSceneTransitionPrompt(params: SceneTransitionParams): string {
    return StoryTemplates.SCENE_TRANSITION_PROMPT.replace(
      '{current_scene}',
      params.current_scene,
    )
      .replace('{next_scene}', params.next_scene)
      .replace('{transition_reason}', params.transition_reason);
  }

  static formatPlotDevelopmentPrompt(params: PlotDevelopmentParams): string {
    return StoryTemplates.PLOT_DEVELOPMENT_PROMPT.replace(
      '{current_plot}',
      params.current_plot,
    )
      .replace('{tension_level}', params.tension_level)
      .replace('{target_direction}', params.target_direction);
  }
}

export { StoryTemplates };
export type {
  NarrativePromptParams,
  ContinuationPromptParams,
  SceneTransitionParams,
  PlotDevelopmentParams,
};
