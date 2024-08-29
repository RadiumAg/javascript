() => {
  // Set 值的成员是唯一的
  const s = new Set();
  [2, 3, 5, 4, 5, 2, 2].forEach(_ => s.add(_));
  for (const i of s) {
    console.log(i);
  }
};

() => {
  const set = new Set();
  // add 返回自身
  set.add(Number.NaN).add(Number.NaN);

  console.log(set.entries());
};

// WeakSet的成员只能是对象和Symbol值
() => {
  const ws = new WeakSet();
  ws.add(Symbol());
};

// WeakRef
(() => {
  const target = {};
  const wr = new WeakRef(target);

  const obj = wr.deref();
  if (obj) {
  }
})();

// FinalizationRegistry
(() => {
  // 新建一个注册表实例
  let a = { a: 1 };
  const register = new FinalizationRegistry(value => {
    console.log(value);
  });

  register.register(a, 'some value');
  a = null;

  function makeWeakCached(f) {
    const cache = new Map();
    const cleanup = new FinalizationRegistry(key => {
      const ref = cache.get(key);
      if (ref && !ref.deref()) cache.delete(key);
    });

    return (key: string) => {
      const ref = cache.get(key);
      if (ref) {
        const cached = ref.deref();
        if (cached !== undefined) return cached;
      }

      const fresh = f(key);
      cache.set(key, new WeakRef(fresh));
      cleanup.register(fresh, key);
      return fresh;
    };
  }
})();
