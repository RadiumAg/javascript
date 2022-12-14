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
