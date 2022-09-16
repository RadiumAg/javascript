import { reactive, useEffect } from '..';

// 代理Set,Map
const proxy = reactive(new Map([['key', 1]]));

useEffect(() => {
  // console.log(proxy.size);
});

proxy.delete('key');
proxy.set('key', 2);

// 添加;
const setReactive = reactive(new Set([1, 2, 3]));

useEffect(() => {
  // console.log(setReactive.size);
});

setReactive.add(4);

// 数据污染
const m = new Map();
const p1 = reactive(m);
const p2 = reactive(new Map());
p1.set('p2', p2);
useEffect(() => {
  console.log(m.get('p2').size);
});

m.get('p2').set('foo', 1);
