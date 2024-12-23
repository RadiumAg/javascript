// 递归
/**
 *
 * 简单起见，让我们写一个函数 pow(x, n)，它可以计算 x 的 n 次方。换句话说就是，x 乘以自身 n 次。
 * pow(2, 2) = 4
 * pow(2, 3) = 8
 * pow(2, 4) = 16
 *
 */

(() => {
  function pow(x, n) {
    if (n === 1) {
      return x;
    } else {
      return x * pow(x, n - 1);
    }
  }

  console.log(pow(2, 3));
})();

/**
 * Rest参数与Spread语法
 */
(() => {
  function sumAll(...args) {
    let sum = 0;

    for (const arg of args) sum += arg;

    return sum;
  }

  console.log(sumAll(1, 2, 3, 4));

  const arr = [3, 5, 1];
  console.log(Math.max(...arr));
})();
