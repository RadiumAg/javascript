Promise.myAll = promiseArray => {
  const result = [];
  let resolveFn;
  let rejectFn;

  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  promiseArray.forEach((promise, index) => {
    promise.then(
      value => {
        result[index] = value;

        if (
          result.filter(_ => _ !== undefined).length === promiseArray.length
        ) {
          resolveFn(result);
        }
      },
      reason => {
        rejectFn(reason);
      },
    );
  });

  return promise;
};

const a = Promise.myAll([Promise.reject(1), Promise.resolve(2)]);
const b = Promise.myAll([Promise.resolve(1), Promise.resolve(2)]);

setTimeout(() => {
  console.log(a);
});

setTimeout(() => {
  console.log(b);
});
