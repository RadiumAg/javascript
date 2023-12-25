const State = {
  pending: 'pending',
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

  resolvePromise(value) {
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
    } else if (value && typeof value === 'object') {
      const thenable = Reflect.get(value, 'then');

      if (typeof thenable === 'function') {
        try {
          thenable.call(value, this.resolve.bind(this), this.reject.bind(this));
          return false;
        } catch (e) {
          this.reject(e);
          return false;
        }
      }
    } else if (value && typeof value === 'function') {
      if (Reflect.has(value, 'then')) {
        return this.resolvePromise(Reflect.get(value, 'then'));
      }

      if (value) {
        try {
          value.call(value, this.resolve.bind(this), this.reject.bind(this));
          return false;
        } catch (e) {
          this.reject(e);
          return false;
        }
      }
    }

    return true;
  }

  resolve(value) {
    if (this.state !== State.pending) return;
    if (!this.resolvePromise(value)) return;

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
            if (typeof onFulfilled === 'function') {
              const result = onFulfilled(this.value);
              resolve(result);
            } else {
              resolve(this.value);
            }
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
                const result = onRejected(this.reason);
                resolve(result);
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

MyPromise.deferred = function () {
  const result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

process.on('uncaughtException', error => {
  // console.error('Unhandled error:', error);
});

module.exports = MyPromise;
