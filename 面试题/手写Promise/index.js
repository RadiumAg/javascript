class MyPromise {}

(() => {
  const a = new Promise(() => {});
  console.log(Object.is(a.then() === a));
})();
