import { CharacterContextManager } from './actors/context_manager';
import { StoryState } from './story/story_state';
import { shouldTriggerConflict, shouldTriggerUnderstanding } from './story/trigger_rule';
import { EmotionUpdate } from './engine/emotion_updater';
import { ResponseCoordinator } from './engine/response_coordinator';

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

  async runStoryLoop() {
    console.log('\n【系统】剧情演化开始...\n');
    for (let index = 0; index < 3; index++) {
      const phase = this.state.getCurrentPhase();
      console.log(`\n--第${index + 1} . 剧情阶段【${phase}】--`);

      // 1. 各角色生成回应
      const responses: Record<string, string> = {};
      for (const name of this.characterNames) {
        const ctx = this.contexts[name];
        const prompt = ctx.buildPrompt(phase);
        const response = await ctx.generateResponse(prompt);
        ctx.updateContext(response);
        responses[name] = response;
        console.log(`${name}: ${response}`);
      }

      // 2. 更新角色情绪
      for (const name of this.characterNames) {
        const ctx = this.contexts[name];
        const result = await this.emotionUpdater.forward(
          name,
          ctx.getProfile(),
          [],
          responses[name],
        );
        console.log(
          `【情绪】${name}: ${result.emotion}(${result.emotion_intensity})`,
        );
      }

      // 3. 检测触发器
      const messages = Object.values(responses);
      if (shouldTriggerConflict(messages)) {
        this.state.setFlag('冲突已触发');
        console.log('\n【系统】冲突已触发！剧情进入紧张阶段。');
      }
      if (shouldTriggerUnderstanding(messages)) {
        this.state.setFlag('理解已建立');
        console.log('\n【系统】理解已建立！角色之间产生了共鸣。');
      }

      // 4. 协调角色回应
      const phaseContext = `剧情阶段：${phase}，冲突状态：${this.state.getFlag('冲突已触发')}，理解状态：${this.state.getFlag('理解已建立')}`;
      const coordinated = await this.responseCoordinator.coordinateResponses(
        phaseContext,
        responses,
      );
      console.log(`\n【剧情推进】${coordinated}`);

      this.state.advancePhase();
    }

    // 5. 最终状态报告
    console.log('\n【系统】剧情演化结束');
    console.log(`冲突已触发：${this.state.getFlag('冲突已触发')}`);
    console.log(`理解已建立：${this.state.getFlag('理解已建立')}`);
  }
}

export { StoryDirector };
