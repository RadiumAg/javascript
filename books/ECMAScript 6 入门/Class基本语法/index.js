// 类所有方法都定义在类的prototype属性上
(() => {
  class Point {
    constructor() {}

    toString() {}

    toValue() {}
  }

  // 等同于

  Point.prototype = {
    constructor() {},
    toString() {},
    toValue() {},
  };
})();

(() => {
  class A {}
  class B {}

  // B的实例继承A的实例
  Object.setPrototypeOf(B.prototype, A.prototype);

  // B继承A的静态属性
  Object.setPrototypeOf(B, A);
})();

/**
 * super表示父类的constructor
 */
(() => {
  class Point {}
  class ColorPoint extends Point {
    constructor(x, y, color) {
      super(x, y); //
      this.color = color;
    }

    toString() {
      return `${this.color} ${super.toString()}`; // 调用父类toString()
    }
  }
})();

/**
 * 只有调用super之后，才可以使用this关键字
 */
(() => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  class ColorPoint extends Point {
    constructor(x, y, color) {
      this.color = color;
      super(x, y); //
      this.color = color;
    }

    toString() {
      return `${this.color} ${super.toString()}`; // 调用父类toString()
    }
  }
})();

/**
 * 只有调用super之后，才可以使用this关键字
 */
(() => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  class ColorPoint extends Point {
    constructor(x, y, color) {
      this.color = color;
      super(x, y); //
      this.color = color;
    }

    toString() {
      return `${this.color} ${super.toString()}`; // 调用父类toString()
    }
  }
})();

/**
 *  super既可以当函数使用，也可以当对象使用,但是定义在父类实例上的方法或属性，是无法通过super调用的。
 */
(() => {
  class A {
    P() {
      return 2;
    }
  }
  class B extends A {
    constructor() {
      super();
      console.log(super.P());
    }
  }

  console.log(new B());
})();

// 类修饰器
(() => {
  function testable(target) {
    target.prototype.isTestable = true;
  }

  //@testable
  class MyTestableClass {}
})();

// 继承
(() => {
  class Point {}

  class ColorPoint extends Point {
    constructor(x, y, color) {
      super(x, y); // 必须通过父类的构造函数完成塑造
      this.color = color;
    }

    toString() {
      return `${this.color}   ${super.toString()}`;
    }
  }
})();

// 私有属性和私有方法的继承
(() => {
  class Foo {
    #p = 1;

    #m() {
      console.log('hello');
    }
  }

  class Bar extends Foo {
    constructor() {
      super();
      console.log(this.#p);
      this.#m();
    }
  }
})();

// 静态属性和静态方法的继承
(() => {
  class A {
    static hello() {
      console.log('hello world');
    }
  }

  class B extends A {}

  B.hello();
})();
