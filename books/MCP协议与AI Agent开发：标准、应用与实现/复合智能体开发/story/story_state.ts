class StoryState {
  private phases: string[] = ['相遇', '冲突', '理解'];
  private currentIndex: number = 0;
  private flags: Record<string, boolean> = {
    '冲突已触发': false,
    '理解已建立': false,
  };

  getCurrentPhase(): string {
    return this.phases[this.currentIndex];
  }

  advancePhase(): void {
    if (this.currentIndex < this.phases.length - 1) {
      this.currentIndex++;
    }
  }

  setFlag(key: string, value: boolean = true): void {
    this.flags[key] = value;
  }

  getFlag(key: string): boolean {
    return this.flags[key] ?? false;
  }

  reset(): void {
    this.currentIndex = 0;
    for (const key of Object.keys(this.flags)) {
      this.flags[key] = false;
    }
  }
}

export { StoryState };
