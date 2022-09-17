type PromiseState = 'fulfilled' | 'rejected' | 'pending';
type AnyFun = (...args) => Promise<any> | any;

function resolvePromise(result: unknown, self: MyPromise, resolve, reject) {
  if (result === self) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>')
    );
  }

  if (typeof result === 'object' || typeof result === 'function') {
    if (result === null) return resolve(result);
    let then;

    try {
      then = result['then'];
    } catch (e) {
      return reject(e);
    }

    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          result,
          (r) => {
            if (called) return;
            called = true;
            resolvePromise(result, r, resolve, reject);
          },
          (j) => {
            if (called) return;
            called = true;
            reject(j);
          }
        );
      } catch (e) {
        if (called) return;
        reject(e);
      }
    } else {
      resolve(result);
    }
  } else {
    resolve(result);
  }
}

class MyPromise<T = any> {
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  #onFulFilledCallback: Function[] = [];

  #onRejectedCallback: Function[] = [];

  private PromiseState: PromiseState = 'pending';

  private PromiseResult: T;

  static resolve(param: unknown) {
    if (param instanceof MyPromise) {
      return param;
    }

    return new MyPromise((resolve) => {
      resolve(param);
    });
  }

  static reject(param: unknown) {
    if (param instanceof MyPromise) {
      return param;
    }

    return new MyPromise((resolve, reject) => {
      reject(param);
    });
  }

  resolve(result?: any) {
    if (this.PromiseState !== 'pending') return;
    this.PromiseResult = result;
    this.PromiseState = 'fulfilled';

    // fetch resolve
    while (this.#onFulFilledCallback.length > 0) {
      this.#onFulFilledCallback.shift()?.(result);
    }
  }

  reject(reason?: any) {
    if (this.PromiseState !== 'pending') return;
    this.PromiseResult = reason;
    this.PromiseState = 'rejected';
    // fetch reject
    while (this.#onFulFilledCallback.length > 0) {
      this.#onRejectedCallback.shift()?.(reason);
    }
  }

  // then之后返回一个新值
  then(onFulfilled?: (value) => any, onRejected?: (reason?: any) => any) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (result) => result;
    onRejected = typeof onRejected ==='function' ? onFulfilled : (reason) => {throw reason};
  
    const newPromise = new MyPromise((resolve, reject) => {
      const fullQueueMicrotask = () => {
        queueMicrotask(() => {
          try {
            const res = onFulfilled!(this.PromiseResult);
            resolvePromise(res, newPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const rejectedQueueMicrotask = () => {
        queueMicrotask(() => {
          try {
            const reason = onRejected!(this.PromiseResult);
            resolvePromise(reason, newPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.PromiseState === 'fulfilled') {
        fullQueueMicrotask();
      } else if (this.PromiseState === 'rejected') {
        rejectedQueueMicrotask();
      } else if (this.PromiseState === 'pending') {
        this.#onFulFilledCallback.push(fullQueueMicrotask);
       this.#onRejectedCallback.push(rejectedQueueMicrotask);
      }
    });

    return newPromise;
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;
