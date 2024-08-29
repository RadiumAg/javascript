(() => {
  let checker;

  function myFunc(params) {
    if (checker) {
      checker();
    }

    const str = 'test.';
    console.log(`do myFunc: ${str}`);

    if (!checker) {
      checker = function () {
        console.log(`do Check:${str}`);
      };
    }

    return arguments.callee;
  }

  myFunc()();
})();
