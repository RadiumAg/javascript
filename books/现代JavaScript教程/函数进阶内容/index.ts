/**
 *
 * 递归和堆栈
 * 任何递归都可以用循环来重写。通常循环辩题更有效
 */
(() => {
  /**
   *
   * @param x 底数
   * @param n 指数
   * @returns
   */
  function pow(x, n) {
    return n == 1 ? x : x * pow(x, n - 1);
  }

  console.log(pow(3, 3));
})();
