// Generator 函数是分段执行的，yield语句是暂停执行的标记，而next方法可以恢复执行。

(() => {
  function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
  }

  const hw = helloWorldGenerator();

  console.log(hw.next());
  console.log(hw.next());
  console.log(hw.next());
  console.log(hw.next());
})();

// yield语句
/**
 * 1. 遇到yield语句就暂停执行后面的操作，并将紧跟在yield后的表达式的值作为返回的对象的value属性值
 * 2. 下一次调用next方法时再继续往下执行，直到遇到吓一条yield语句
 * 3. 如果没有再遇到新yield语句，就一直运行到函数结束，直到return语句位置，并将return语句后面的值作为返回对象的value属性值
 * 4. 如果该函数没有return语句，则返回的对象的value属性值为undefined
 */

(() => {
  function* gen() {
    // 不会立即求职，只会在next方法将指针移到这一句时才会求值。
    yield 123 + 456;
  }
})();

(() => {
  const arr = [1, [[2, 3], 4], [5, 6]];

  const flat = function* (a) {
    const length = a.length;
    for (let i = 0; i < length; i++) {
      const item = a[i];
      if (typeof item !== 'number') {
        yield* flat(item);
      } else {
        yield item;
      }
    }
  };

  for (const f of flat(arr)) {
    console.log(f);
  }
})();

// next方法的参数，会被当做上一条yield语句的返回值
(() => {
  function* f() {
    for (let i = 0; true; i++) {
      const reset = yield i;
      if (reset) {
        i = -1;
      }
    }
  }

  const g = f();

  g.next();
  g.next();
  g.next(true);
})();

// 实现斐波那契
(() => {
  function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
      [prev, curr] = [curr, prev + curr];
      yield curr;
    }
  }

  for (const n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
  }
})();

// Generator.prototype.throw()
(() => {
  const g = function* () {
    while (true) {
      try {
        // 没有try catch将会被外部捕获
        yield;
      } catch (e) {
        if (e !== 'a') throw e;
        console.log('内部捕获', e);
      }
    }
  };

  const i = g();
  i.next();

  try {
    i.throw('a');
    i.throw('b');
  } catch (e) {
    console.log('外部捕获', e);
  }
})();

// Generator.prototype.return()
(() => {})();
