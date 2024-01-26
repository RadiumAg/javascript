function __await(fun: GeneratorFunction) {
  let resolveFn: (value: unknown) => void;
  let rejectFn: (value: unknown) => void;
  const generator = fun();
  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  const adopt = (value: unknown) => {
    return value instanceof Promise ? value : Promise.resolve(value);
  };

  const step = (preValue?: unknown) => {
    try {
      const { value, done } = generator.next(preValue);

      adopt(value).then(
        nextValue => {
          if (done) {
            resolveFn(nextValue);
          } else {
            step(nextValue);
          }
        },
        reason => {
          if (done) {
            rejectFn(reason);
          } else {
            step(reason);
          }
        },
      );
    } catch (e) {
      rejectFn(e);
    }
  };

  step();
  return promise;
}

const promise = __await(function* a() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
});
