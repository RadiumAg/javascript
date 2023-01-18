() => {
  const zeroes = [0, 0, 0, 0, 0];
  zeroes.fill(5);
  zeroes.fill(0);
  zeroes.fill(7, 1, 3);

  // copyWithin
  let inits: number[] = [],
    reset = () => (inits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  reset();

  inits.copyWithin(4, 0, 3);
  console.log(inits);

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

  // conact
  const colors = ['red', 'green', 'blue'];
  const colors2 = colors.concat('yellow', ['black', 'brown']);
  // console.log(colors2);

  const buf = new ArrayBuffer(16);
  const vm = new DataView(buf);
  vm.setInt16(0, 16);
  // console.log(buf);
  // console.log(vm.getInt8(0));
};

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
