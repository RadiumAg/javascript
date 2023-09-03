import { reactive, useEffect } from '..';

// 代理Set,Map
() => {
  const proxy = reactive(new Map([['key', 1]]));
  useEffect(() => {
    // console.log(proxy.size);
  });

  proxy.delete('key');
  proxy.set('key', 2);
};

// 添加
() => {
  const setReactive = reactive(new Set([1, 2, 3]));

  useEffect(() => {
    // console.log(setReactive.size);
  });

  setReactive.add(4);
};

// 数据污染
() => {
  const testMap = new Map();
  const p1 = reactive(testMap);
  const p2 = reactive(new Map());
  p1.set('p2', p2);
  useEffect(() => {
    // console.log(m.get('p2').size);
  });

  testMap.get('p2').set('foo', 1);
};

// forEach
() => {
  const m = reactive(new Map([[{ key: 1 }, { value: 1 }]]));
  useEffect(() => {
    m.forEach((value, key) => {
      // console.log(value);
      // console.log(key);
    });
  });
  // 能够触发响应
  m.set({ key: 2 }, { value: 2 });
};

() => {
  const key = { key: 1 };
  const value = new Set([1, 2, 3]);
  const p = reactive(new Map([[key, value]]));

  useEffect(() => {
    p.forEach((value, key) => {
      // console.log(value.size);
    });
  });

  p.get(key).delete(1);
  p.set('key', 2);
};

() => {
  const p3 = reactive(new Map([['key', 1]]));

  useEffect(() => {
    p3.forEach((value, key) => {
      // console.log(value);
    });
  });

  p3.set('key', 2);
};

// 迭代器方法
// entries
() => {
  const p = reactive(
    new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]),
  );

  useEffect(() => {
    for (const [key, value] of p) {
      console.log(key, value);
    }
  });

  for (const [key, value] of p.entries()) {
    console.log(key, value);
  }
};

(() => {
  const p = reactive(
    new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]),
  );

  useEffect(() => {
    for (const [key, value] of p.keys()) {
      console.log(key, value);
    }
  });

  p.set('key2', 'value3');
})();
