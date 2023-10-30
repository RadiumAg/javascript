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
