abstract class AbstractClass {
  public templateMethod() {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }

  /**
   * These operations already have implementations.
   */
  protected baseOperation1(): void {
    console.log('AbstractClass says: I am doing the bulk of the work');
  }

  protected baseOperation2(): void {
    console.log(
      'AbstractClass says: But I let subclasses override some operations'
    );
  }

  protected baseOperation3(): void {
    console.log(
      'AbstractClass says: But I am doing the bulk of the work anyway'
    );
  }

  /**
   * These operations have to be implemented in subclasses.
   */
  protected abstract requiredOperations1(): void;

  protected abstract requiredOperation2(): void;

  /**
   * These are "hooks." Subclasses may override them, but it's not mandatory
   * since the hooks already have default (but empty) implementation. Hooks
   * provide additional extension points in some crucial places of the
   * algorithm.
   */
  protected hook1(): void {}

  protected hook2(): void {}
}

export class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log('ConcreteClass1 says: Implemented Operation1');
  }

  protected requiredOperation2(): void {
    console.log('ConcreteClass1 says: Implemented Operation2');
  }
}

/**
 * Usually, concrete classes override only a fraction of base class' operations.
 */
class ConcreteClass2 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log('ConcreteClass2 says: Implemented Operation1');
  }

  protected requiredOperation2(): void {
    console.log('ConcreteClass2 says: Implemented Operation2');
  }

  protected hook1(): void {
    console.log('ConcreteClass2 says: Overridden Hook1');
  }
}

function clientCode(abstractClass: AbstractClass) {
  abstractClass.templateMethod();
}

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass1());
console.log('');

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass2());
