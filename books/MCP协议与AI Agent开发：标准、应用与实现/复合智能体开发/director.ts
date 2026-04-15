import { CharacterContextManager } from './actors/context_manager';

interface Context {
  name: string;
  phase: string;
}

class StoryDirector {
  characterNames = ['艾琳', '诺亚'];
  context: Record<string, any> = {};
  storyPhases = ['相遇', '冲突', '理解'];
  phaseIndex = 0;

  initializeCharacters() {
    this.context = [];
    this.phaseIndex = 0;
  }

  runStoryLoop() {
    console.log('\n【系统】剧情演化开始...\n');
    for (let index = 0; index <= 3; index++) {
      const phase = this.storyPhases[this.phaseIndex];
      console.log(`\n--第${index + 1} . 剧情阶段【${phase}】--`);

      for (const name of this.characterNames) {
        this.context[name] = new CharacterContextManager(name);
        this.context[name].initializeContext();
        console.log(
          '【系统】初始化完成，当参与角色',
          this.characterNames.join(`、`),
        );
        console.log(
          '\n【背景】再遥远的未来，艾琳与诺亚,艾琳与诺亚在星舰上初次相遇，他们的名誉即将交汇...',
        );
      }
    }
  }
}

export { StoryDirector };
