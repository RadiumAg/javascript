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
