(() => {
  /**
   * 未处理的rejection,使用unhandledrejection事件可以捕获promise的错误
   */

  const promise = Promise.reject(new Error('Promise Failed'));
  promise.catch(() => console.log('caught'));
  process.on('unhandledrejection', (event) => console.log(event.reason));
})();

/**
 * 返回 promise
 */

(() => {
  // eslint-disable-next-line no-new
  new Promise((resolve) => {
    setTimeout(() => resolve(1), 1000);
  })
    .then((result) => {
      console.log(result);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(result * 2, 1000);
        });
      });
    })
    .then((result) => {
      console.log(result);
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(result * 2), 1000);
      });
    })
    .then((result) => {
      console.log(result);
    });
})();

/**
 * thenables 自动调用对象的then方法
 */

(() => {
  class Thenable {
    constructor (num) {
      this.num = num;
    }

    then (resolve, reject) {
      console.log(resolve);
      setTimeout(() => resolve(this.num * 2), 1000);
    }
  }

  new Promise((resolve) => resolve(1))
    .then((result) => new Thenable(result))
    .then(console.log);
})();
