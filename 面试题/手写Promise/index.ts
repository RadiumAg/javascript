type PromiseState = 'fulfilled' | 'rejected' | 'pending';
type AnyFun = (...args) => Promise<any> | any;

class MyPromise<T = any> {
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  private PromiseState: PromiseState = 'pending';

  private PromiseResult: T;

  resolve(result?: any) {
    this.PromiseResult = result;
    this.PromiseState = 'fulfilled';
  }

  reject(reason?: any) {
    this.PromiseResult = reason;
    this.PromiseState = 'fulfilled';
  }

  then(successFn: (value) => any, failFn?: (reason?: any) => any) {
    if (this.PromiseState === 'fulfilled') {
      const res = successFn?.(this.PromiseResult);
      return new MyPromise((resolve) => {
        resolve(res);
      });
    } else if (this.PromiseState === 'rejected') {
      const reason = failFn?.(this.PromiseResult);
      return new MyPromise((resolve, reject) => {
        reject(reason);
      });
    }
  }

  catch(fn: AnyFun) {}
}

console.log(
  new MyPromise((resolve) => {
    resolve(2);
  })
    .then((result) => {
      return 1;
    })
    ?.then(() => {})
);

MyPromise.deferred = function () {
  const result = {
    promise: undefined,
    resolve: undefined,
    reject: undefined,
  };

  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;
