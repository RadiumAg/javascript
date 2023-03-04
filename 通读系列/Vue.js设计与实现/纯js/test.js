import { bucket, effect, reactive } from './effect.js';

// 原始 Map 对象 m
const m = new Map();
// p1 是 m 的代理对象
const p1 = reactive(m);
// p2 是另外一个代理对象
const p2 = reactive(new Map());
// 为 p1 设置一个键值对，值是代理对象 p2
p1.set('p2', p2);

effect(() => {
  // 注意，这里我们通过原始数据 m 访问 p2
  console.log(m.get('p2').size);
});
// 注意，这里我们通过原始数据 m 为 p2 设置一个键值对 foo --> 1
m.get('p2').set('foo', 1);

console.log(bucket);
