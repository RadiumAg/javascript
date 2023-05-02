// 异步加载图片
() => {
  function loadImageAsync(url: string) {
    return new Promise((resolve, reject) => {
      //   const image = new Image();
      //   image.addEventListener('load', () => {
      //     resolve(image);
      //   });
      //   image.onerror = () => {
      //     reject(new Error(`Could not load image at${url}`));
      //   };
      //   image.src = url;
    });
  }
};

// 加入resolve传入的是一个promise,则以传入的promise的状态为主
() => {
  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('fail')), 3000);
  });

  const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(p1), 1000);
  });

  p2.then(result => console.log(result));
  p2.catch(error => console.log(error));
};

// catch
(() => {
  const promise = new Promise((resolve, reject) => {
    throw new Error('test');
  });

  // 虽然 Promise里运行的是同步的代码，但是也能抛出错误
  promise.catch(error => {
    console.log(error);
  });
})();

// Promise.resolve 产生现有的fullfill Promise 对象

(() => {
  Promise.resolve('foo');
  new Promise(resolve => resolve('foo'));
  // 两个等价
})();

// generator 函数与 Promise的结合
(() => {
  function getFoo() {
    return new Promise((resolve, reject) => {
      resolve('foo');
    });
  }

  const g = function* () {
    try {
      const foo = yield getFoo();
      console.log(foo);
    } catch (e) {
      console.log(e);
    }
  };

  function run(generator) {
    const it = generator();

    function go(result) {
      if (result.done) return result.value;

      return result.value.then(
        value => {
          return go(it.next(value));
        },
        error => {
          return go(it.throw(error));
        },
      );
    }

    go(it.next());
  }

  run(g);
})();

// Generator yield表示暂停的地方
// 向Generator函数体内输入数据
(() => {
  function* gen(x) {
    const y = yield x + 2; // y 会变成输入的2
    return y;
  }

  const g = gen(1);
  g.next();
  g.next(2);
})();
