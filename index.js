<<<<<<< HEAD
=======

function run (fn) {
  const gen = fn();

  function next (_error, data) {
    const result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

const a = function () {
  return (arg) => { arg(); };
};

function * b () {
  const c = yield a();
  console.log(c);
}

console.log(run(b));
>>>>>>> a5a9515e1536afa06d0a4584ebf5ff26bb152e77
