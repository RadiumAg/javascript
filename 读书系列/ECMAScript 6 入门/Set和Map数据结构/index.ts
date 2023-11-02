() => {
  // Set 值的成员是唯一的
  const s = new Set();
  [2, 3, 5, 4, 5, 2, 2].forEach(_ => s.add(_));
  for (const i of s) {
    console.log(i);
  }
};

(() => {
  const set = new Set();
  // add 返回自身
  set.add(Number.NaN).add(Number.NaN);

  Set.prototype;
})();

// WeakSet的成员只能是对象和Symbol值
() => {
  const ws = new WeakSet();
  ws.add(Symbol());
};
