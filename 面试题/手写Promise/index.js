const State = {
  pending: 'pedding',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

class MyPromise {
  value; // 成功的值
  reason; // 失败的理由
  state = State.pending;
  onFulfilledFnArray = [];
  onRejectedFnArray = []; // 为了可以 let a = Promise; a.then(); a.then()

  constructor(exector) {
    exector?.(this.resolve.bind(this), this.reject.bind(this));
  }

  static resolve(value) {
    return new MyPromise(resolve => {
      resolve(value);
    });
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }

  specialValue(value) {
    if (value === this) {
      this.reject(
        new TypeError(
          'Circular reference detected: promise and x are the same object',
        ),
      );

      return false;
    } else if (value instanceof MyPromise) {
      value.then(this.resolve.bind(this), this.reject.bind(this));
      return false;
    } else if (typeof value === 'object' && value['then'] !== undefined) {
      value.then(this.resolve.bind(this), this.reject.bind(this));
      return false;
    }

    return true;
  }

  resolve(value) {
    if (!this.specialValue(value)) return;
    if (this.state !== State.pending) return;

    this.value = value;
    this.state = State.fulfilled;

    while (this.onFulfilledFnArray.length > 0) {
      this.onFulfilledFnArray.shift()(); // 不是立即执行
    }
  }

  reject(reason) {
    if (this.state !== State.pending) return;

    this.reason = reason;
    this.state = State.rejected;

    while (this.onRejectedFnArray.length > 0) {
      this.onRejectedFnArray.shift()(); // 不是立即执行
    }
  }

  catch(onFulfilled) {
    return this.then(undefined, onFulfilled);
  }

  then(onFulfilled, onRejected) {
    let onFulfilledFn;
    let onRejectedFn;
    const nextPromise = new MyPromise((resolve, reject) => {
      onFulfilledFn = function () {
        queueMicrotask(() => {
          try {
            const result =
              typeof onFulfilled === 'function' && onFulfilled(this.value);
            resolve(result || this.value);
          } catch (e) {
            reject(e);
          }
        });
      };

      onRejectedFn = function () {
        queueMicrotask(() => {
          try {
            if (onRejected) {
              if (typeof onRejected === 'function') {
                const result = onRejected?.(this.reason);
                resolve(result || this.reason);
              } else {
                reject(this.reason);
              }
            } else {
              reject(this.reason);
            }
          } catch (e) {
            reject(e);
          }
        });
      };
    });

    onFulfilledFn = onFulfilledFn.bind(this);
    onRejectedFn = onRejectedFn.bind(this);

    if (this.state === State.fulfilled) {
      onFulfilledFn();
    } else if (this.state === State.rejected) {
      onRejectedFn();
    } else {
      this.onFulfilledFnArray.push(onFulfilledFn);
      this.onRejectedFnArray.push(onRejectedFn);
    }

    return nextPromise;
  }
}

() => {
  // 多次调用;
  const a = new MyPromise((resolve, reject) => {
    setTimeout(() => resolve(2));
  });

  a.then(() => {
    console.log('first');
  });

  a.then(() => {
    console.log('seconed');
  });
};

() => {
  function delay(ms, value) {
    return new MyPromise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, ms);
    });
  }

  const promise1 = delay(1000, 'Promise1 was fulfilled after a delay!');

  const promise2 = promise1.then();

  promise2.then(result => {
    console.log('Promise2 is fulfilled with the same value:', result);
  });
};

//
() => {
  function delay(ms, value) {
    return new MyPromise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, ms);
    });
  }

  const promise1 = delay(1000, 'Promise1 was fulfilled after a delay!');

  const promise2 = promise1.then(false);

  promise2.then(result => {
    console.log('Promise2 is fulfilled with the same value:', result);
  });

  const rejectedPromise = Promise.reject(new Error('Rejected!'));

  rejectedPromise
    .catch(() => {
      const x = Object.create(null); // 创建一个拥有 null 原型的对象
      x.then = function (onFulfilled) {
        onFulfilled('Thenable fulfilled!');
      };
      return x; // 返回拥有 null 原型的对象
    })
    .then(result => {
      console.log('Returned value from thenable:', result); // 输出："Returned value from thenable: Thenable fulfilled!"
    });
};

//
() => {
  function delay(ms, value) {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        reject(value);
      }, ms);
    });
  }

  const promise1 = delay(1000, 'Promise1 was fulfilled after a delay!');

  const promise2 = promise1.then(false, false);

  promise2.then(
    () => {},
    result => {
      console.log('Promise2 is fulfilled with the same value:', result);
    },
  );
};

() => {
  const myPromise = new MyPromise(resolve => {
    resolve('Hello, Promise!');
  });

  const samePromise = myPromise.then(() => {
    return samePromise; // 返回了同一个Promise对象
  });

  setTimeout(() => {
    console.log(samePromise);
  });
};

() => {
  const promise1 = new MyPromise((resolve, reject) => {
    // 模拟一个异步操作，1秒后兑现
    setTimeout(() => {
      resolve('Promise1 fulfilled!');
    }, 1000);
  });

  const promise2 = new MyPromise((resolve, reject) => {
    // 模拟一个异步操作，2秒后兑现
    setTimeout(() => {
      resolve('Promise2 fulfilled!');
    }, 2000);
  });

  const promise3 = promise1.then(() => promise2);

  promise3.then(
    result => {
      console.log('promise3 fulfilled with the same value:', result);
    },
    error => {
      console.error('promise3 rejected:', error.message);
    },
  );
};

() => {
  const fulfilledPromise = Promise.resolve();

  const a = fulfilledPromise.then(() => {
    const x = Object.create(null); // 创建一个拥有 null 原型的对象
    x.then = function () {};
    return x; // 返回拥有 null 原型的对象
  });

  setTimeout(() => {
    console.log(a);
  });
};

MyPromise.deferred = function () {
  const result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;
