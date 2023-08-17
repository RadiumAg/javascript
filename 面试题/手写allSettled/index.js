Promise.myAllSettled = promiseArray => {
  const result = [];
  let resolveFn;

  const promise = new Promise(resolve => {
    resolveFn = resolve;
  });

  promiseArray.forEach((promise, index) => {
    promise.then(
      value => {
        result[index] = { status: 'fulfilled', value };

        if (
          result.filter(_ => _ !== undefined).length === promiseArray.length
        ) {
          resolveFn(result);
        }
      },
      reason => {
        result[index] = { status: 'reject', reason };

        if (
          result.filter(_ => _ !== undefined).length === promiseArray.length
        ) {
          resolveFn(result);
        }
      },
    );
  });

  return promise;
};

const a = Promise.myAllSettled([Promise.reject(1), Promise.resolve(2)]);
const b = Promise.myAllSettled([Promise.resolve(1), Promise.resolve(2)]);

setTimeout(() => {
  console.log(a);
});

setTimeout(() => {
  console.log(b);
});
