// thenable
() => {
  const thenable = {
    then: (resolve, reject) => {
      setTimeout(() => {
        resolve(42);
      }, 1000);
    },
  };

  const promise = Promise.resolve(thenable);

  promise.then(
    (value) => {
      console.log(value);
    },
    (reason) => {
      console.log(reason);
    },
  );
};

(() => {
  const resolve = Promise.resolve();
  console.log(resolve === Promise.resolve(resolve));
  console.log(resolve === Promise.reject(resolve));
})();
