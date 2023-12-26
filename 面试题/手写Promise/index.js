const State = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

class MyPromise {
  value; // 成功的值
  reason; // 失败的理由
  state = State.pending;
  called = false;
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
      try {
        value.then(this.resolve.bind(this), this.reject.bind(this));
        return false;
      } catch (e) {
        this.reject(e);
        return false;
      } finally {
        this.called = true;
      }
    } else if (value && typeof value === 'object') {
      try {
        const thenable = Reflect.get(value, 'then');
        if (typeof thenable === 'function') {
          try {
            thenable.call(
              value,
              this.resolve.bind(this),
              this.reject.bind(this),
            );
            return false;
          } catch (e) {
            if (this.called) return;
            this.reject(e);
            return false;
          }
        }
      } catch (e) {
        this.reject(e);
        return false;
      }
    } else if (value && typeof value === 'function') {
      try {
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
      } catch (e) {
        this.reject(e);
        return false;
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

(() => {
  const y = {
    get then() {
      throw new Error('访问`then`时出错');
    },
  };

  const x = {
    then(resolvePromise, rejectPromise) {
      // 异步使用`y`解析
      MyPromise.resolve().then(() => {
        resolvePromise(y); // 这一行将永远不会到达，因为`y.then`抛出了错误
      });
    },
  };

  new MyPromise((resolve, reject) => {
    // 这里`x`作为我们的thenable对象
    resolve(x);
  }).then(
    value => {
      console.log('成功实现，值为:', value);
    },
    reason => {
      console.error('被拒绝，理由为:', reason);
    },
  );
})();

module.exports = MyPromise;
