import { bucket, effect, reactive } from './effect.js';

// const p = reactive(new Map([[{ key: 1 }, { value: 1 }]]));

// effect(() => {
//   p.forEach((value, key) => {
//     console.log(value); // { value: 1 }
//     console.log(key); // { key: 1 }
//   });
// });

// // 能够触发响应
// p.set({ key: 2 }, { value: 2 });

const p = reactive(
  new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ]),
);

effect(() => {
  // TypeError: p is not iterable
  for (const [key, value] of p) {
    console.log(key, value);
  }
});

p.set('key3', 'value3');
console.log(bucket);
