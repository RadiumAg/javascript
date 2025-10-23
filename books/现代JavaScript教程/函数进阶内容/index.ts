/**
 *
 * 递归和堆栈
 * 任何递归都可以用循环来重写。通常循环辩题更有效
 * 作用域是上下文的一部分
 * 变量对象（Variable Object）存储函数内部的变量、函数声明、参数等。
 *
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

/**
 *
 * 递归遍历
 *
 */
(() => {
  let company = {
    sales: [
      {
        name: 'John',
        salary: 1000,
      },
      {
        name: 'Alice',
        salary: 1600,
      },
    ],

    development: {
      sites: [
        {
          name: 'Peter',
          salary: 2000,
        },
        {
          name: 'Alex',
          salary: 1800,
        },
      ],

      internals: [
        {
          name: 'Jack',
          salary: 1300,
        },
      ],
    },
  };

  function sumSalaries(department) {
    if (Array.isArray(department)) {
      return department.reduce((prev, current) => prev + current.salary, 0);
    } else {
      let sum = 0;
      for (let subdep of Object.values(department)) {
        sum += sumSalaries(subdep);
      }
      return sum;
    }
  }

  console.log(sumSalaries(company));
})();

/**
 * 
 * 对数字求和到给定值
  重要程度: 5
  编写一个函数 sumTo(n) 计算 1 + 2 + ... + n 的和。

  举个例子：

  sumTo(1) = 1
  sumTo(2) = 2 + 1 = 3
  sumTo(3) = 3 + 2 + 1 = 6
  sumTo(4) = 4 + 3 + 2 + 1 = 10
  ...
  sumTo(100) = 100 + 99 + ... + 2 + 1 = 5050
  用三种方式实现：

  使用循环。
  使用递归，对 n > 1 执行 sumTo(n) = n + sumTo(n-1)。
  使用 等差数列 求和公式.
  结果示例：
 * 
 */

(() => {
  // 1.递归
  let max = 4;
  const result = Array.from({ length: max + 1 }).reduce<number>(
    (total, current, currentIndex) => {
      return (total += currentIndex);
    },
    0,
  );

  console.log('递归结果', result);

  function sum(current = 0) {
    if (current === max) return current;
    return current + sum(current + 1);
  }

  console.log('递归结果', sum());

  function sumTo(n: number): number {
    return (n * (1 + n)) / 2;
  }

  console.log('等差数列', sumTo(4));
})();

/**
 *
 *
 * 全局对象
 *
 */

(() => {})();
