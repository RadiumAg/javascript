function __await(fun) {
  let resolveFn;
  let rejectFn;
  const generator = fun();
  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  const adopt = value => {
    return value instanceof Promise ? value : Promise.resolve(value);
  };

  const step = nextValue => {
    try {
      const { value, done } = generator.next(nextValue);

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
  return yield Promise.resolve(1);
});

console.log(promise);
