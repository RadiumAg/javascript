function run(fn) {
  const gen = fn();

  function next(data?, err?) {
    const res = gen.next(data);
    if (res.done) return;
    next(res.value);
  }

  next();
}

function* g() {
  const a = yield 1;
  console.log(a);
  const b = yield 2;
  console.log(b);
}

run(g);
