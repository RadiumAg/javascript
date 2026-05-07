import { CharacterContextManager } from './actors/context_manager';

class StoryDirector {
  characterNames = ['艾琳', '诺亚'];
  contexts: Record<string, any> = {};
  storyPhases = ['相遇', '冲突', '理解'];
  phaseIndex = 0;

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
      const phase = this.storyPhases[this.phaseIndex];
      console.log(`\n--第${index + 1} . 剧情阶段【${phase}】--`);

      for (const name of this.characterNames) {
        const ctx = this.contexts[name];
        const prompt = ctx.buildPrompt(phase);
        const response = await ctx.generateResponse(prompt);
        ctx.updateContext(response);
        console.log(`${name}: ${response}`);
      }

      this.advancePhase();
    }
  }

  advancePhase() {
    if (this.phaseIndex < this.storyPhases.length - 1) {
      this.phaseIndex++;
    }
  }
}

export { StoryDirector };
