// 递归
/**
 *
 * 简单起见，让我们写一个函数 pow(x, n)，它可以计算 x 的 n 次方。换句话说就是，x 乘以自身 n 次。
 * pow(2, 2) = 4
 * pow(2, 3) = 8
 * pow(2, 4) = 16
 *
 */
() => {
  function pow(x, n) {
    if (n === 1) {
      return x;
    } else {
      return x * pow(x, n - 1);
    }
  }

  console.log(pow(2, 3));
};

/**
 * Rest参数与Spread语法
 */
() => {
  function sumAll(...args) {
    let sum = 0;

    for (const arg of args) sum += arg;

    return sum;
  }

  console.log(sumAll(1, 2, 3, 4));

  const arr = [3, 5, 1];
  console.log(Math.max(...arr));
};

/**
 * 浏览器会将setTimeout或SetInterval的五层或更多嵌套调用的最小延时限制在4ms
 */
(() => {
  const start = Date.now();
  const times = [];

  setTimeout(function run() {
    times.push(Date.now() - start); // 保存前一个调用的延时

    if (start + 100 < Date.now()) {
      console.log(times); // 100 毫秒之后，显示延时信息
    } else setTimeout(run); // 否则重新调度
  });

  // 输出示例：
  // 1,1,1,1,9,15,20,24,30,35,40,45,50,55,59,64,70,75,80,85,90,95,100
})();

/**
 * 装饰器模式和转发，call/apply
 */
(() => {
  const worker = {
    someMethod() {
      return 1;
    },

    slow(x) {
      alert(`Called with ${x}`);
      return x * this.someMethod(); // (*)
    },
  };

  function cachingDecorator(func) {
    const cache = new Map();

    return function (x) {
      if (cache.has(x)) {
        return cache.get(x);
      }

      const result = func.call(this, x); // 现在 “this“ 被正确的传递了

      cache.set(x, result);
      return result;
    };
  }

  worker.slow = cachingDecorator(worker.slow);
  console.log(worker.slow(1));
})();
