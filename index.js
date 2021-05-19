
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
