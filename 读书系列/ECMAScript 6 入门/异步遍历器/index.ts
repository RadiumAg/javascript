async function* createAsyncIterable(syncIterable) {
  for (const elem of syncIterable) {
    yield elem;
  }
}

(() => {
  const asyncIterable = createAsyncIterable(['a', 'b']);
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();

  asyncIterator
    .next()
    .then(iterResult1 => {
      console.log(iterResult1);
      return asyncIterator.next();
    })
    .then(iterResult2 => {
      console.log(iterResult2);
      return asyncIterable.next();
    })
    .then(iterResult3 => {
      console.log(iterResult3);
    });

  async function f() {
    const asyncIterable = createAsyncIterable(['a', 'b']);
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();
    console.log(await asyncIterator.next());
    console.log(await asyncIterator.next());
    console.log(await asyncIterator.next());
  }
})();

// 同步遍历器
(() => {
  function idMaker() {
    let index = 0;

    return {
      next() {
        return { value: index++, done: false };
      },
    };
  }
  const it = idMaker();

  it.next().value;
  it.next().value;
  it.next().value;
})();
