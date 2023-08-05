// 属性的类型
// ECMA-262使用一些内部特性来描述属性的特征。这些特征是由为JavaScript实现引擎的规范定义的。因此，不能在JavaScript中直接访问这些特性
// 为了将某个特性标识为内部特性，规范会用两个中括号把特性的名称括起来
// 比如[[Prototpye]]

// writeable
() => {
  const person = {};
  Object.defineProperty(person, 'name', {
    writable: false,
    value: 'Nicholas',
  });

  console.log(person.name); //Nicholas
  person.name = 'Greg';
  console.log(person.name); //Nicholas
};

// configurable
() => {
  const person = {};
  Object.defineProperty(person, 'name', {
    configurable: false,
    value: 'Nicholas',
  });

  Object.defineProperty(person, 'name', {
    configurable: true,
    value: 'Nicholas',
  });
};

// 访问器属性
() => {
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
};

// 定义多个属性
() => {
  const book = {};
  Object.defineProperties(book, {
    year_: {
      value: 2017,
    },
    edition: {
      value: 1,
    },
    year: {
      get() {
        return this.year_;
      },
      set(newValue) {
        if (newValue > 2017) {
          this.year_ = newValue;
          this.edition += newValue - 2017;
        }
      },
    },
  });
};

// 读取属性的特征
(() => {
  const book = {};
  Object.defineProperties(book, {
    year_: {
      value: 2017,
    },
    edition: {
      value: 1,
    },
    year: {
      get() {
        return this.year_;
      },
      set(newValue) {
        if (newValue > 2017) {
          this.year_ = newValue;
          this.edition += newValue - 2017;
        }
      },
    },
  });

  console.log(Object.getOwnPropertyDescriptor(book, 'year_'));
  console.log(Object.getOwnPropertyDescriptors(book));
})();

// 合并对象Object.assign
// Object.propertyIsEnumerable() === true && Object.hasOwnProperty() === true
() => {
  let dest, src, result;
  dest = {};
  src = { id: 'src' };
  result = Object.assign(dest, src);

  console.log(dest === result);
  console.log(dest !== src);

  console.log(result);
  console.log(dest);
  /**
   * 多个源对象
   */

  dest = {};
  result = Object.assign(dest, { a: 'foo' }, { b: 'bar' });
  console.log(result);

  /**
   * 获取函数与设置函数
   */

  dest = {
    set a(val) {
      this.b = val;
      console.log(`Invoked dest setter with param ${val}`);
    },
  };

  src = {
    get a() {
      console.log('Invokded src getter');
      return 'foo';
    },
  };

  Object.assign(dest, src);
  // 调用src的获取方法
  // 调用dest的设置方法并传入参数"foo"
  // 因为这里的设置函数不执行赋值操作
  // 所以实际上并没有把之传递过来
  console.log(dest);
};

// 不能在两个对象间转移获取函数和设置函数
(() => {
  let dest, src, result;

  /**
   * 覆盖属性
   */
  dest = { id: 'dest' };
  result = Object.assign(
    dest,
    { id: 'srcl', a: 'foo' },
    { id: 'src2', b: 'bar' },
  );

  // Object.assign会覆盖重复的属性
  console.log(result);

  // 可以通过目标对象上的设置函数观察到赋值的过程：
  dest = {
    set id(x) {
      console.log(x);
    },
  };

  Object.assign(dest, { id: 'first' }, { id: 'second' }, { id: 'third' });

  /**
   * 对象引用
   */

  dest = {};
  src = { a: {} };
  Object.assign(dest, src);
  // 浅赋值意味着只会复制对象的引用
  console.log(dest);
  console.log(dest.a === src.a); //true
})();

// 对象标识以及相等判定
(() => {
  console.log(+0 === -0); //true
  console.log(+0 === 0); //true
  console.log(-0 === 0); //true

  console.log(Object.is(+0, -0)); // false
  console.log(Object.is(+0, 0)); // true
  console.log(Object.is(-0, 0)); // false
  console.log(Object.is(Number.NaN, Number.NaN)); // true;
})();

// 不使用对象解构
(() => {
  const person = {
    name: 'Matt',
    age: 25,
  };
  const { name: personName, age: personAge } = person;
  console.log(personName);
  console.log(personAge);
})();

// 解构赋值的同时定义默认值
(() => {
  const person = {
    name: 'Matt',
    age: 25,
  };
  const { a = '1' } = person;
  console.log(a);
})();

// 解构在内部使用函数ToObject
(() => {
  const { length } = 'foobar';
  console.log(length);
})();

// 嵌套解构
(() => {
  const person = {
    name: 'Matt',
    age: 27,
    job: {
      title: 'Software engineer',
    },
  };

  const personCopy = {};

  ({
    name: personCopy.name,
    age: personCopy.age,
    job: personCopy.job,
  } = person);

  person.job.title = 'Hacker';
  console.log(person);
  console.log(personCopy);

  const {
    job: { title },
  } = person;

  console.log(title);
})();

// 创建对象几个方式
