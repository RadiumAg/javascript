export class Context {
  private state: State;

  constructor(state: State) {
    this.transistionTo(state);
  }

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

/**
 * The base State class declares methods that all Concrete State should
 * implement and also provides a backreference to the Context object, associated
 * with the State. This backreference can be used by States to transition the
 * Context to another State.
 */
abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract handle1(): void;

  public abstract handle2(): void;
}

class ConcreteStateA extends State {
  public handle1(): void {
    console.log('ConcreteStateA handles request1.');
    console.log('ConcreteStateA wants to change the state of the context.');
    this.context.transistionTo(new ConcreteStateB());
  }
  public handle2(): void {
    console.log('ConcreteStateA handles request2.');
  }
}

class ConcreteStateB extends State {
  public handle1(): void {
    console.log('ConcreteStateB handles request1.');
  }

  public handle2(): void {
    console.log('ConcreteStateB handles request2.');
    console.log('ConcreteStateB wants to change the state of the context.');
    this.context.transistionTo(new ConcreteStateA());
  }
}

/**
 * The client code.
 */
const context = new Context(new ConcreteStateA());
context.request1();
context.request2();
