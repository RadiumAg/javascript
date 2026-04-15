interface Context {
  name: string;
  phase: string;
}

class StoryDirector {
  characterNames = ['艾琳', '诺亚'];
  context: Context[] = [];
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
    }
  }
}

export { StoryDirector };
