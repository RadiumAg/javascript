class Context {
  private state: State;

  constructor(state: State) {}

  transistionTo(state: State) {
    console.log(`Context: Transition to ${state.constructor.name}`);
    this.state = state;
    this.state.setContext(this);
  }

  /**
   * The Context delegates part of its behavior to the current State object
   *
   */
  public request1() {
    this.state.handle1();
  }

  public request2() {
    this.state.handle2();
  }
}

abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract handle1(): void;

  public abstract handle2(): void;
}

class CooncreteState extends State {
  public handle1(): void {
    throw new Error('Method not implemented.');
  }
  public handle2(): void {
    throw new Error('Method not implemented.');
  }
}
