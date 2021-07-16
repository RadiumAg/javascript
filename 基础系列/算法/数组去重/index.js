// const set = new Set();
// const a = [1, 2, 1, 2];
// a.forEach(set.add);
// const result = Array.from(set);
// console.log(result);

const a = {
  b: 1,
  c: function () {},
  d: undefined,
  e: () => {},
  f: null,
  g () {}
};

console.log(JSON.parse(JSON.stringify(a)));
