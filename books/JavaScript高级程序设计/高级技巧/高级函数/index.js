(function () {
  function Person(name, age, job) {
    // if(this instanceof Person) {
    //     this.name = name;
    //     this.age = age;
    //     this.job = job;
    // }else {
    //     return new Person(name,age,job);
    // }

    if (new.target) {
      this.name = name;
      this.age = age;
      this.job = job;
    } else {
      return new Person(name, age, job);
    }
  }

  const person1 = Person('Nicholas', 29, 'Software Engineer');
  console.log(window.name);
  console.log(person1.name);
})();

(() => {
  // 返回了一个新作用域对象
  function Polygon(sides) {
    if (new.target) {
      this.sides = sides;
      this.getArea = function () {};
    } else {
      return new Polygon(sides);
    }
  }

  function Rectangle(width, height) {
    Polygon.call(this, 2);
    this.width = width;
    this.height = height;
    this.getArea = function () {
      return this.width * this.height;
    };
  }
  const react = new Rectangle(5, 10);
  console.log(react.sides);
})();

() => {
  function Polygon(sides) {
    if (new.target) {
      this.sides = sides;
      this.getArea = function () {
        return 0;
      };
    } else {
      return new Polygon(sides);
    }
  }

  function Rectangle(width, height) {
    Polygon.call(this, 2);
    this.width = width;
    this.height = height;
    this.getArea = function () {
      return this.width * this.height;
    };
  }
  Rectangle.prototype = new Polygon();
  const rect = new Rectangle(5, 10);
  console.log(rect.sides);
};

/**
 * 函数柯里化
 */

(() => {
  function add(num1, num2) {
    return num1 + num2;
  }

  function curriedAdd(num2) {
    return add(5, num2);
  }

  console.log(add(2, 3));
  console.log(curriedAdd(3));

  // 动态创建函数柯里化
  function curry(fn) {
    const args = Array.prototype.slice.call(arguments, 1);
    return function () {
      const innerArgs = Array.prototype.slice.call(arguments);
      const finalArgs = args.concat(innerArgs);
      return fn.apply(null, finalArgs);
    };
  }
})();
