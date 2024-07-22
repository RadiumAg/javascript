/**
 *  用户代码主要用两种方法来得到一个promise对象
 * 1. 使用 new Promise() 来创建一个promise
 * 2. 使用类方法Promise.XXX()包括.resolve()，.reject，.all()或.race等来获得一个promise
 */

/**
 * 当执行器executor在执行过程触发异常时，JavaScript引擎也将调用reject并作为reasean
 *
 */
() => {
  const p = new Promise((resolve, reject) => {
    throw new Error('出错了'); // 创建异常并抛出，相当于reject(new Error)
    resolve(1);
  });
};

// Promise的其它类方法
() => {
  // 得到一个rejected promise
  const p1 = Promise.reject(1); // x 是任意值，如果不指定定则为undefined

  // 得到一个resolved promise
  const p2 = Promise.resolve(1); // x 是任意值，如果不指定则为undefined

  // 尝试resolve所有元素
  // -当所有元素都resolved，则得到一个将所有结果作为resolved array的promise；或
  // -当任意一个元素rejected，则得到一个该结果 resean 的 rejected promise
  const p3 = Promise.all([1]); // x 必须是可迭代对象（集合对象，或有迭代器的对象）

  // 尝试resolve所有元素
  // - 当其任一元素resolved或rejected，都将以该结果作为结果promise
  // - （注，所有其它元素的状态是未确定的，并且他们的执行过程与结果不确定）
  const p4 = Promise.race([1]);
};

(() => {
  function sleep(tag, n, value) {
    console.log(tag);
    return new Promise(resolve => setTimeout(() => resolve(value), n));
  }

  async function* myAsyncGenerator() {
    yield sleep('yild lst', 10000, 'value 1 delay 10s');
    yield sleep('yild 2nd', 1000, 'value 2 now');
  }
})();

() => {
  const onFinally = () => {
    try {
      return f2();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const thenFinally = x => {
    const result = onFinally(); // 模拟调用f2()并返回result的过程
    const p3 = Promise.resolve(result); // result 可能是值或Promise对象
    const valueThunk = () => x; // 忽略result，返回x
    return p3.then(valueThunk);
  };

  const catchFinally = reason => {
    const result = onFinally();
    const p3 = Promise.resolve(result);
    const thrower = () => {
      throw reason; // 将reason作为异常抛出
    };
    return p3.then(thrower);
  };

  const p3 = p2.then(thenFinally, catchFinally);
};

// Promise.resolve处理thenable对象的具体方法
(() => {
  // 将x声明为一个thenable对象
  const x = {
    then() {
      console.log('in thenable object ....');
    },
  };
  const p2 = Promise.resolve(x);

  console.log(p2 === x);
})();
