// 接收可迭代对象的原生语言特性包括“
// 1. for of 循环
// 2. 数组解构
// 3. 扩展操作符
// 4. Array.from
// 5. 创建集合
// 6. 创建映射
// 7. Promise.all 接收由期约组成的可迭代对象
// 8. Promise.race 接收由期约组成的可迭代对象

// 可迭代对象（iterable）
// iterator 接口，可迭代协议
() => {
  const num = 1;
  const obj = {};

  console.log(num[Symbol.iterator]);
  console.log(obj[Symbol.iterator]);

  const str = 'abc';
  const arr = ['a', 'b', 'c'];

  const map = new Map().set('a', 1).set('b', 2);
  const set = new Set().add('a').add('b');

  console.log(str[Symbol.iterator]);
  console.log(arr[Symbol.iterator]);
  console.log(map[Symbol.iterator]);
  console.log(set[Symbol.iterator]);

  // iterator会生成一个迭代对象（iterable）
  console.log(str[Symbol.iterator]());
  console.log(arr[Symbol.iterator]());
  console.log(map[Symbol.iterator]());
  console.log(set[Symbol.iterator]());
};

// 接受可迭代对象的原生语言特性包括：
// 1. for-of 循环
// 2. 数组解构
// 3. 扩展操作符
// 4. Array.from()
// 5. 创建集合 new Set({ *[Symbol.iterator](){} })
// 6. 创建映射 new Map({ *[Symbol.iterator](){} })
// 7. Promise.all()接收由Promise组成的可迭代对象
// 8. Promise.race()接收由契约组成的可迭代对象
// 9. yield* 操作符，在生成器中使用

() => {
  // 可迭代对象
  const arr = ['foo', 'bar'];
  // 迭代工厂函数
  console.log(arr[Symbol.iterator]);
  // 迭代器
  const iter = arr[Symbol.iterator]();
  console.log(iter);

  // 执行迭代
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
};

// next方法返回的迭代器对象IteratorResult包含两个属性:done和value。done是一个布尔值,表示是否还可以调用next()取得下一个值
() => {
  const arr = ['foo', 'bar'];
  // 迭代器工厂函数
  console.log(arr[Symbol.iterator]);

  // 迭代器
  const iter = arr[Symbol.iterator]();
  console.log(iter);

  // 执行迭代
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
};

// 如果可迭代对象在迭代期间被修改了，那么迭代器也会反应相应的变化
() => {
  const arr = ['foo', 'baz'];
  const iter = arr[Symbol.iterator]();
  console.log(iter.next());

  // 在数组中间插入值
  arr.splice(1, 0, 'bar');

  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
};

// 自定义迭代器
() => {
  class Counter {
    private limit: number;

    constructor(limit: number) {
      this.limit = limit;
    }

    [Symbol.iterator]() {
      let count = 1;
      const limit = this.limit;

      return {
        next() {
          if (count <= limit) {
            return { done: false, value: count++ };
          } else {
            return { done: true, value: undefined };
          }
        },
      };
    }
  }

  const counter = new Counter(10);

  for (const i of counter) {
    console.log(i);
  }

  for (const i of counter) {
    console.log(i);
  }
};

// 提前终止迭代器
// return 方法必须返回一个有效的iteratorResult对象
// 可选的return方法用于指定在迭代器提前关闭时的逻辑。
// 执行迭代对结构在想让迭代器知道它不想遍历到可迭代对象耗尽时，就可以“关闭”迭代器器。可能的情况包括：
// 1. for of 循环通过break，continue，return或throw提前退出
// 2. 解构操作并未消费所有值

() => {
  class Counter {
    private limit: number;

    constructor(limit) {
      this.limit = limit;
    }

    [Symbol.iterator]() {
      let count = 1;
      const limit = this.limit;

      return {
        next() {
          if (count < limit) {
            return { done: false, value: count++ };
          } else {
            return { done: true };
          }
        },

        return() {
          console.log('Exitingeraly');
          return { done: true };
        },
      };
    }
  }

  // 提前关闭
  const counter1 = new Counter(5);
  for (const i of counter1) {
    if (i > 2) {
      break;
    }
    console.log(i);
  }

  // 提前关闭
  const counter2 = new Counter(5);
  try {
    for (const i of counter2) {
      if (i > 2) {
        throw 'err';
      }
      console.log(i);
    }
  } catch {}
};

() => {
  const a = [1, 2, 3, 4, 5];
  const iter = a[Symbol.iterator]();

  iter.return = function () {
    console.log('Exitingearly');
    return { done: true };
  };

  for (const i of iter) {
    console.log(i);
    if (i > 2) {
      break;
    }
  }

  for (const i of iter) {
    console.log(i);
  }
};
