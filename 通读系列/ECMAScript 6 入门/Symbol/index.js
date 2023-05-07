// 作为属性名的Symbol ,所以说属性名可以是symbol 和 string
(() => {
  const mySymbol = Symbol();
  const a = {
    [mySymbol]: 'Hello!',
  };
})();

// 消除魔术字符串
(() => {
  const shapeType = {
    triangle: Symbol(),
  };

  function getArea(shape, options) {
    let area = 0;

    switch (shape) {
      case shapeType.triangle:
        area = 0.5 * options.width * options.height;
        break;
    }

    return area;
  }

  getArea(shapeType.triangle, { width: 100, height: 100 });
})();

// 属性名的遍历
// Object.getOwnPropertySymbols返回一个数组，成员是当前对象的所有用作属性名的Symbol值
(() => {
  const obj = {};
  const a = Symbol('a');
  const b = Symbol.for('b');

  obj[a] = 'Hello';
  obj[b] = 'World';

  const objectSymbols = Object.getOwnPropertySymbols(obj);

  console.log(objectSymbols); //[ Symbol(a), Symbol(b) ]
  console.log(Object.getOwnPropertyNames(obj));
})();

// Reflect.ownKeys方法可以返回所有类型的键名
(() => {
  const obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3,
  };

  console.log(Reflect.ownKeys(obj));
})();

// symbol.for('') 注册同一个symbol值
(() => {
  Symbol.for('bar') === Symbol.for('bar');
})();

// symbol.keyFor,返回一个已登记的Symbol类型值的key
(() => {
  const s1 = Symbol.for('foo');
  console.log(Symbol.keyFor(s1)); //"foo"
})();

// Symbol.hasInstance
(() => {
  class MyClass {
    static [Symbol.hasInstance](foo) {
      console.log('输出', foo);
      return false;
    }
  }

  const o = new MyClass();
  // eslint-disable-next-line unicorn/no-instanceof-array
  console.log(o instanceof MyClass);
})();
