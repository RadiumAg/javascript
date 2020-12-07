// const a = [1, 2, 3, 4],
//   b = [1, 2, 3, 4],
//   c = new Set(),
//   d = [];

// for (let item of [...a, ...b]) {
//   c.add(item);
// }

// c.forEach((x) => {
//   d.push(x);
// })

function a(params) {
  let b = params;
  return c => {
     console.log(b);
  }
}

let d = [a,a,a];
d[0](1)();
d[1](2)();
d[2](4)();



