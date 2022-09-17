const p = Promise.resolve('Hello');

p.then(function (s) {
  console.log(s);
});

console.log(1);
