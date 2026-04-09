enum TaskState {
  INIT,
  PARSED,
  CLASSIFIED,
  SUMMARIZED,
  REPLIED,
  ARCHIVED,
  COMPLIETED,
}

class StateMachine {
  state: TaskState = TaskState.INIT;
  constructor() {
    this.state = TaskState.INIT;
  }

  next() {
    if (this.state === TaskState.INIT) {
      this.state = TaskState.PARSED;
    } else if (this.state === TaskState.PARSED) {
      this.state = TaskState.CLASSIFIED;
    } else if (this.state === TaskState.CLASSIFIED) {
      this.state = TaskState.SUMMARIZED;
    } else if (this.state === TaskState.SUMMARIZED) {
      this.state = TaskState.REPLIED;
    } else if (this.state === TaskState.REPLIED) {
      this.state = TaskState.ARCHIVED;
    } else if (this.state === TaskState.ARCHIVED) {
      this.state = TaskState.COMPLIETED;
    }
  }

  isTerminal() {
    return this.state === TaskState.COMPLIETED;
  }

  reset() {
    this.state = TaskState.INIT;
  }
}

export { StateMachine };
