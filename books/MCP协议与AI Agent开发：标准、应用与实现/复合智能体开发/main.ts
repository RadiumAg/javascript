import { StoryDirector } from './director';

async function main(): Promise<void> {
    // 初始化导演控制器
    const director = new StoryDirector();
    await director.initializeCharacters();
    await director.runStoryLoop();
}

main();
