/**
 *  用户代码主要用两种方法来得到一个promise对象
 * 1. 使用 new Promise() 来创建一个promise
 * 2. 使用类方法Promise.XXX()包括.resolve()，.reject，.all()或.race等来获得一个promise
 */

/**
 * 当执行器executor在执行过程触发异常时，JavaScript引擎也将调用reject并作为reasean
 *
 */
(() => {
  const p = new Promise((resolve, reject) => {
    throw new Error('出错了'); // 创建异常并抛出，相当于reject(new Error)
    resolve(1);
  });
})();

// Promise的其它类方法

(() => {
  // 得到一个rejected promise
  const p = Promise.reject(1); // x 是任意值，如果不指定定则为undefined

  // 得到一个resolved promise
  const p = Promise.resolve(1); // x 是任意值，如果不指定则为undefined

  // 尝试resolve所有元素
  // -当所有元素都resolved，则得到一个将所有结果作为resolved array的promise；或
  // -当任意一个元素rejected，则得到一个该结果 resean 的 rejected promise
  const p = Promise.all([1]); // x 必须是可迭代对象（集合对象，或有迭代器的对象）

  // 尝试resolve所有元素
  // - 当其任一元素resolved或rejected，都将以该结果作为结果promise
  // - （注，所有其它元素的状态是未确定的，并且他们的执行过程与结果不确定）
  const p = Promise.race([1]);
})();
