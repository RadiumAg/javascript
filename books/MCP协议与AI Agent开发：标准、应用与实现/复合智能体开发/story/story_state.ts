interface CharacterState {
  [key: string]: unknown;
}

interface PlotThread {
  [key: string]: unknown;
}

interface StorySummary {
  current_scene: string;
  characters_count: number;
  plot_threads_count: number;
  mood: string;
}

class StoryState {
  private currentScene: string = '';
  private characters: Record<string, CharacterState> = {};
  private plotThreads: PlotThread[] = [];
  private mood: string = 'neutral';
  private history: string[] = [];

  updateScene(newScene: string): void {
    this.history.push(this.currentScene);
    this.currentScene = newScene;
  }

  updateCharacterState(charName: string, state: CharacterState): void {
    this.characters[charName] = state;
  }

  addPlotThread(thread: PlotThread): void {
    this.plotThreads.push(thread);
  }

  setMood(mood: string): void {
    this.mood = mood;
  }

  getSummary(): StorySummary {
    return {
      current_scene: this.currentScene,
      characters_count: Object.keys(this.characters).length,
      plot_threads_count: this.plotThreads.length,
      mood: this.mood,
    };
  }
}

export { StoryState };
export type { CharacterState, PlotThread, StorySummary };
