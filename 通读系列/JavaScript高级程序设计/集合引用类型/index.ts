() => {
  // 迭代器模式
  class Counter {
    count: number;
    limit: number;

    constructor(limit: number) {
      this.count = 1;
      this.limit = limit;
    }

    next() {
      if (this.count <= this.limit) {
        return { done: false, value: this.count++ };
      } else {
        return { done: true, value: undefined };
      }
    }

    [Symbol.iterator]() {
      return this;
    }
  }

  const counter = new Counter(3);

  for (const i of counter) {
    console.log(i);
  }
};
// 多次迭代
() => {
  class Counter {
    limit: number;
    constructor(limit: number) {
      this.limit = limit;
    }

    [Symbol.iterator]() {
      let count = 1;
      const limit = this.limit;
      console.log('return');
      return {
        next() {
          if (count <= limit) {
            return { done: false, value: count++ };
          } else {
            return { done: true, value: undefined };
          }
        },

        return() {
          console.log('Exitingearly');
          return { done: true, value: undefined };
        },
      };
    }
  }

  const counter = new Counter(5);
  for (const i of counter) {
    console.log(i);
  }

  for (const i of counter) {
    if (i && i > 2) {
      break;
    }
    console.log(i);
  }

  const counter2 = new Counter(5);

  try {
    for (const i of counter2) {
      if (i && i > 2) {
        throw 'err';
      }
    }
  } catch {}

  const counter3 = new Counter(5);
  const [a, b] = counter3;

  const c = [1, 2, 3, 4, 5];
  const iter = c[Symbol.iterator]();
  iter['return'] = () => {
    console.log('Exitingearly');
    return { done: true, value: undefined };
  };

  for (const i of iter) {
    console.log(i);
    if (i > 2) break;
  }
};

// 生成器
(() => {
  function* generatorFn() {}
  const foo = {
    *generatorFn() {},
  };
  const g = generatorFn();
  console.log(g[Symbol.iterator]());
  console.log(g === g[Symbol.iterator]());
})();

// 产生可迭代对象
(() => {
  function* generatorFn() {
    yield* [1, 2, 3];
    yield* [3, 4];
    yield* [5, 6];
  }

  const genatorObject = generatorFn();
  for (const x of genatorObject) {
    console.log(x);
  }
})();

// Object.defineProperty
(() => {
  const person: any = {};
  Object.defineProperty(person, 'name', {
    writable: false,
    value: 'Nicholas',
  });
  console.log(person.name);
  person.name = 'Greg';
  console.log(person.name);
})();

// 设置属性访问器

(() => {
  const book = {
    year_: 2017,
    edition: 1,
  };

  Object.defineProperty(book, 'year', {
    get() {
      return this.year_;
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017;
      }
    },
  });
  book.year = 2018;
  console.log(book.edition);
})();

(() => {
  let dest, src, result;
  dest = {};
  src = { id: 'src' };
  result = Object.assign(dest, src);
  console.log(dest === result);
  console.log(dest !== src);
  console.log(result);

  dest = {
    set a(val) {
      console.log(`Invoked dest setter with param ${val}`);
    },
  };
})();

// Object.is 考虑边界情况
(() => {
  console.log(Object.is(+0, -0)); // false
  console.log(Object.is(+0, 0)); // false
  console.log(Object.is(-0, 0)); // false
  console.log(Object.is(Number.NaN, Number.NaN));
})();

// 解构
(() => {
  // 内部调用 toObject
  const { length } = 'foobar';
  console.log(length);
  const { constructor } = 4;
})();

// 嵌套结构
(() => {
  const person = {
    name: 'Matt',
    age: 27,
    job: {
      title: 'Softwrae enngineer',
    },
  };

  const personCopy = {
    name: '',
    age: 1,
    job: {
      title: '`',
    },
  };
  ({
    name: personCopy.name,
    age: personCopy.age,
    job: personCopy.job,
  } = person);
})();

// 属性可以是string,number(自动转成string),symbol

// 创建数组
(() => {
  // 使用Array构造函数
  // eslint-disable-next-line @typescript-eslint/no-array-constructor, unicorn/no-new-array
  new Array(20);
  // eslint-disable-next-line unicorn/no-new-array, @typescript-eslint/no-array-constructor
  new Array('red', 'blue', 'green');

  // 省略new
  // eslint-disable-next-line @typescript-eslint/no-array-constructor, unicorn/no-new-array, prettier/prettier, unicorn/new-for-builtins
   Array(20);
  // eslint-disable-next-line unicorn/no-new-array, @typescript-eslint/no-array-constructor, unicorn/new-for-builtins
  Array('red', 'blue', 'green');

  // 数组字面量
  const colors = ['red', 'blue', 'green'];
})();

// Array.from,Array.of
(() => {
  console.log(Array.from('Matt')); // 字符串会被拆分成单字母数组

  // 可以使用from()将集合和映射转换成一个新数组
  const m = new Map().set(1, 2).set(3, 4);
  const s = new Set().add(1).add(2).add(3).add(4);

  console.log(Array.from(m));
  console.log(Array.from(s));

  // Array.from对现有数组执行浅复制
  const a1 = [1, 2, 3, 4];
  const a2 = Array.from(a1);

  console.log(a1);
  console.log(a1 === a2); // false

  // 可以使用任何迭代对象
  const iter = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
    },
  };

  console.log(Array.from(iter));
  // arguments对象可以轻松地转换为数组

  function getArgsArray() {
    return Array.from(arguments);
  }

  console.log(getArgsArray(1, 2, 3, 4));

  // from也能转换带有必要属性的自定义对象
  const arrayLikeObject = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    length: 4,
  };

  console.log(Array.from(arrayLikeObject));
})();

// from 第三个参数
(() => {
  const a1 = [1, 2, 3, 4];
  const a2 = Array.from(a1, x => x ** 2);

  const a3 = Array.from(
    a1,
    x => {
      return x ** this.exponent;
    },
    { exponent: 2 },
  );

  console.log(a2);
  console.log(a3);
})();

// 数组空位
(() => {
  const options = [, , , , ,]; // 空位元素为undefined
  console.log(options.length); //5
  console.log(options);

  const options1 = [1, , , , 5];
  for (const option of options1) {
    console.log(option === undefined);
  }

  const a = Array.from([, , ,]); // 使用ES6的Array.from()创建的包含3 个空位的数组
  for (const val of a) {
    console.log(val === undefined);
  }
  // true
  // true
  // true

  console.log(Array.of(...[, , ,])); // [undefined, undefined, undefined, undefined]

  for (const [index, value] of options.entries()) {
    console.log(value);
  }
  // 1
  // undefined
  // undefined
  // undefined
  // 5
})();

// 通过修改length属性，可以从数组末尾删除或添加元素
(() => {
  const colors = ['blue', 'blue', 'green'];
  colors.length = 2;
  console.log(colors[2]); // undefined
})();

// 如果将length设置为大于数组元素数的值，则新添加的元素都将以undefined填充
(() => {
  const colors = ['red', 'blue', 'green'];
  colors.length = 4;
  console.log(colors[3]); // undefined
})();

// 使用length向数组末尾添加元素
(() => {
  const colors = ['red', 'blue', 'green'];
  // 创建一个包含3 个字符串数组
  colors[colors.length] = 'black';
  // 添加一种颜色
  colors[colors.length] = 'brown';
})();

// 检测数组
(() => {
  // eslint-disable-next-line unicorn/no-instanceof-array
  if ([] instanceof Array) {
    // 操作数组
  }

  if (Array.isArray([])) {
  }
})();

// 迭代器方法
(() => {
  // keys(),values(),entries()
  const a = ['foo', 'bar', 'baz', 'qux'];
  // 通过Array.from()直接转换为数组实例
  const aKeys = Array.from(a.keys());
  const aValues = Array.from(a.values());
  const aEntries = Array.from(a.entries());
})();

// fill
(() => {
  const zeroes = [0, 0, 0, 0, 0];
  zeroes.fill(5);
  zeroes.fill(0);
  zeroes.fill(7, 1, 3);

  // fill()静默忽略超出数组边界，零长度及方向相反的索引范围
  console.log(zeroes.fill(1, -10, -6));
  console.log(zeroes.fill(1, 10, 15));
  console.log(zeroes.fill(2, 4, 2));
  console.log(zeroes.fill(4, 3, 10));
})();

// copyWithin
(() => {
  console.log('copyWithin');

  let ints: number[] = [],
    reset = () => (ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  reset();
  // 从ints中复制索引0 开始的内容，插入到索引5 开始的位置
  // 在源索引活目标索引达到数组边界时停止

  ints.copyWithin(5);
  console.log(ints);
  reset();

  // 从ints中复制索引5开始的内容，插入到索引0开始的位置
  ints.copyWithin(0, 5);
  console.log(ints);
  reset();

  // 从ints中复制索引0 开始到索引3 结束的内容
  // 插入到索引4 开始的位置
  ints.copyWithin(4, 0, 3);
  console.log(ints);
  reset();
})();

// 转换方法
// 所有对象的都有toLocaleString(),toString(),valueOf方法
(() => {
  const person1 = {
    toLocaleString() {
      return 'Nikolaos';
    },
    toString() {
      return 'Nicholas';
    },
  };

  const person2 = {
    toLocaleString() {
      return 'Grigorios';
    },
    toString() {
      return 'Greg';
    },
  };

  const people = [person1, person2];
  console.log(people.toString()); // 调用每一个成员的toString
  console.log(people.toLocaleString()); // 调用每一个成员的toLocaleString
})();

// 栈方法

(() => {
  const colors: string[] = [];
  let count = colors.push('red', 'green');
  console.log(count);

  count = colors.push('black');
  console.log(count);
  const item = colors.pop();
  console.log(item);
})();

(() => {
  const colors = ['red', 'blue'];
  colors.push('brown');
  colors[3] = 'black';
  console.log(colors.length);
  const item = colors.pop();
  console.log(item);
})();

// shift() push()
(() => {
  const colors: string[] = [];
  const count = colors.push('red', 'green');
  console.log(count);
  const item = colors.shift();
  console.log(item);
  console.log(colors.length);
})();

// unshift() pop()
(() => {
  const colors: string[] = [];
  let count = colors.unshift('red', 'green');
  console.log(count);

  count = colors.unshift('black');
  console.log(count);

  const item = colors.pop();
  console.log(item);
  console.log(colors.length);
})();

// 排序方法
(() => {
  const values = [1, 2, 3, 4, 5];
  values.reverse();
  console.log(values);
})();

// sort
(() => {
  const values = [0, 1, 5, 10, 15];
  // 第一个参数应该排在第二个参数前面，就返回负值，如果相等，就返回0，如果第一个参数应该排在第二个参数后面，就返回正值
  values.sort((value1, value2) => {
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  });

  values.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
})();

(() => {
  // conact
  const colors = ['red', 'green', 'blue'];
  const colors2 = colors.concat('yellow', ['black', 'brown']);
  console.log(colors2);
})();
