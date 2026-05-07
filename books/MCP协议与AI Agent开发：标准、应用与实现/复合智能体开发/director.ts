import { CharacterContextManager } from './actors/context_manager';
import { StoryState } from './story/story_state';
import { shouldTriggerConflict, shouldTriggerUnderstanding } from './story/trigger_rule';
import { EmotionUpdate } from './engine/emotion_updater';
import { ResponseCoordinator } from './engine/response_coordinator';
import { StoryAgent } from './engine/agent';

class StoryDirector {
  characterNames = ['艾琳', '诺亚'];
  contexts: Record<string, CharacterContextManager> = {};
  state = new StoryState();
  emotionUpdater = new EmotionUpdate();
  responseCoordinator = new ResponseCoordinator();

  async initializeCharacters() {
    console.log('【系统】剧本角色初始化中...\n');
    for (const name of this.characterNames) {
      this.contexts[name] = new CharacterContextManager(name);
      this.contexts[name].initializeContext();
    }
    console.log(
      '【系统】初始化完成，当前参与角色：',
      this.characterNames.join('、'),
    );
    console.log(
      '\n【背景】在遥远的未来，艾琳与诺亚在星舰上初次相遇，他们的命运即将交汇……',
    );
  }

  private buildState(): string {
    const phase = this.state.getCurrentPhase();
    const conflict = this.state.getFlag('冲突已触发');
    const understanding = this.state.getFlag('理解已建立');

    const historySummary = this.characterNames
      .map((name) => {
        const ctx = this.contexts[name];
        const history = ctx.getHistory();
        const recent = history.slice(-3).join(' | ');
        return `  ${name}（发言${history.length}次）：${recent || '尚未发言'}`;
      })
      .join('\n');

    return `剧情阶段：${phase}
冲突已触发：${conflict ? '是' : '否'}
理解已建立：${understanding ? '是' : '否'}
角色状态：
${historySummary}`;
  }

  async runStoryLoop() {
    const agent = new StoryAgent();

    // 注册工具：character_speak
    agent.registerTool({
      name: 'character_speak',
      description: '让指定角色根据当前剧情阶段生成对话回应',
      parameters: { character: '角色名，艾琳 或 诺亚' },
      execute: async (params) => {
        const name = params.character;
        const ctx = this.contexts[name];
        if (!ctx) return `错误：未知角色 ${name}`;
        const phase = this.state.getCurrentPhase();
        const prompt = ctx.buildPrompt(phase);
        const response = await ctx.generateResponse(prompt);
        ctx.updateContext(response);
        return `${name}: ${response}`;
      },
    });

    // 注册工具：update_emotions
    agent.registerTool({
      name: 'update_emotions',
      description: '分析最新对话内容，更新所有角色的情绪状态',
      parameters: {},
      execute: async () => {
        const results: string[] = [];
        for (const name of this.characterNames) {
          const ctx = this.contexts[name];
          const history = ctx.getHistory();
          const lastResponse = history[history.length - 1] || '';
          const result = await this.emotionUpdater.forward(
            name,
            ctx.getProfile(),
            [],
            lastResponse,
          );
          results.push(`${name}: ${result.emotion}(${result.emotion_intensity})`);
        }
        return results.join(', ');
      },
    });

    // 注册工具：check_triggers
    agent.registerTool({
      name: 'check_triggers',
      description: '检测对话中是否触发剧情标记（冲突/理解），并更新状态',
      parameters: {},
      execute: async () => {
        const messages: string[] = [];
        for (const name of this.characterNames) {
          const ctx = this.contexts[name];
          const history = ctx.getHistory();
          if (history.length > 0) {
            messages.push(history[history.length - 1]);
          }
        }
        const results: string[] = [];
        if (shouldTriggerConflict(messages)) {
          this.state.setFlag('冲突已触发');
          results.push('冲突已触发');
        }
        if (shouldTriggerUnderstanding(messages)) {
          this.state.setFlag('理解已建立');
          results.push('理解已建立');
        }
        return results.length > 0 ? results.join('，') : '无新触发';
      },
    });

    // 注册工具：coordinate
    agent.registerTool({
      name: 'coordinate',
      description: '协调所有角色最新回应，生成剧情推进叙述',
      parameters: {},
      execute: async () => {
        const responses: Record<string, string> = {};
        for (const name of this.characterNames) {
          const ctx = this.contexts[name];
          const history = ctx.getHistory();
          responses[name] = history[history.length - 1] || '';
        }
        const phase = this.state.getCurrentPhase();
        const phaseContext = `阶段：${phase}，冲突：${this.state.getFlag('冲突已触发')}，理解：${this.state.getFlag('理解已建立')}`;
        return await this.responseCoordinator.coordinateResponses(
          phaseContext,
          responses,
        );
      },
    });

    // 注册工具：advance_phase
    agent.registerTool({
      name: 'advance_phase',
      description: '推进到下一个剧情阶段（相遇→冲突→理解）',
      parameters: {},
      execute: async () => {
        const oldPhase = this.state.getCurrentPhase();
        this.state.advancePhase();
        const newPhase = this.state.getCurrentPhase();
        if (oldPhase === newPhase) {
          return `无法推进，已到达最后阶段「${newPhase}」`;
        }
        return `阶段已从「${oldPhase}」推进到「${newPhase}」`;
      },
    });

    // 启动 Agent 自主决策
    await agent.run(() => this.buildState());

    // 最终状态报告
    console.log('\n【系统】剧情演化结束');
    console.log(`冲突已触发：${this.state.getFlag('冲突已触发')}`);
    console.log(`理解已建立：${this.state.getFlag('理解已建立')}`);
  }
}

export { StoryDirector };
