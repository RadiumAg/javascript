Promise.myAll = (promiseArray: Promise<any>[]) => {
  let resolveFn: (value: unknown) => void;
  let rejectFn: (value: unknown) => void;
  const result: any[] = [];

  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  promiseArray.forEach((promise, index) => {
    promise.then(
      value => {
        result[index](value);

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

console.log(Promise.myAll([Promise.resolve(1), Promise.resolve(2)]));
